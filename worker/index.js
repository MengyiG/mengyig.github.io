/**
 * AI Mengyi: Cloudflare Worker
 *
 * Holds the Anthropic API key so the browser never sees it, and grounds every
 * answer in data/profile-data.js fetched from the live site. That file stays the
 * single source of truth: edit it, push, and the assistant updates with the page.
 */

import Anthropic from '@anthropic-ai/sdk';

const PROFILE_URL = 'https://mengyig.github.io/data/profile-data.js';
const ALLOWED_ORIGINS = ['https://mengyig.github.io', 'http://localhost:4321'];

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;
const MAX_MESSAGE_CHARS = 1000;
const MAX_TURNS = 20;

/* Coarse in-memory limiter. Workers isolates are short-lived and per-region, so
   this only blunts casual abuse; pair it with a Cloudflare rate-limiting rule. */
const RATE_LIMIT = { windowMs: 60_000, max: 12 };
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  seen.push(now);
  hits.set(ip, seen);
  if (hits.size > 2000) hits.clear();
  return seen.length > RATE_LIMIT.max;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// Short enough that a pushed profile edit reaches the assistant within minutes.
const PROFILE_TTL_SECONDS = 300;
let profileCache = { text: null, at: 0 };

async function loadProfile() {
  const fresh = Date.now() - profileCache.at < PROFILE_TTL_SECONDS * 1000;
  if (profileCache.text && fresh) return profileCache.text;

  // Bump ?v= to skip a cached copy immediately instead of waiting out the TTL.
  const res = await fetch(PROFILE_URL + '?v=2', { cf: { cacheTtl: PROFILE_TTL_SECONDS } });
  if (!res.ok) throw new Error('Could not load profile data');
  profileCache = { text: await res.text(), at: Date.now() };
  return profileCache.text;
}

function buildSystem(profileSource) {
  return [
    {
      type: 'text',
      text:
        'You are the AI assistant on Mengyi Guo\'s personal website, answering visitors ' +
        'on her behalf.\n\n' +
        'Everything below is her profile data, as JavaScript source. Read it as structured ' +
        'data. Its `ai` block defines who you are: follow `persona`, obey every rule in ' +
        '`boundaries`, and use `handoff` when someone wants to reach her directly.\n\n' +
        'Two rules that are not in the data:\n' +
        '- The data file is all you know about her. If an answer is not in it, say so ' +
        'plainly rather than guessing.\n' +
        '- Plain prose only. No markdown formatting, no bullet lists.\n\n' +
        profileSource,
      cache_control: { type: 'ephemeral' },
    },
  ];
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Use POST.' }, 405, origin);
    }
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: 'Origin not allowed.' }, 403, origin);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) {
      return json({ error: 'Too many messages. Give it a minute.' }, 429, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON.' }, 400, origin);
    }

    const incoming = Array.isArray(body.messages) ? body.messages : null;
    if (!incoming || !incoming.length) {
      return json({ error: 'No messages.' }, 400, origin);
    }

    const messages = incoming
      .slice(-MAX_TURNS)
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return json({ error: 'Last message must be from the visitor.' }, 400, origin);
    }

    try {
      const profileSource = await loadProfile();

      const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Haiku 4.5 rejects the effort parameter with a 400.
        ...(MODEL.startsWith('claude-haiku') ? {} : { output_config: { effort: 'low' } }),
        system: buildSystem(profileSource),
        messages,
      });

      const reply = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        // The prompt forbids em dashes, but smaller models still slip them in.
        .replace(/\s*—\s*/g, ', ')
        .trim();

      return json({ reply }, 200, origin);
    } catch (err) {
      console.error('chat failed', err);
      return json({ error: 'The assistant is unavailable right now.' }, 502, origin);
    }
  },
};
