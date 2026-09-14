/**
 * AI Mengyi: Cloudflare Worker
 *
 * Holds the Anthropic API key so the browser never sees it, and grounds every
 * answer in data/profile-data.js fetched from the live site. That file stays the
 * single source of truth: edit it, push, and the assistant updates with the page.
 *
 * It also keeps a visit log in D1 (binding DB): every page view the site reports
 * to POST /visit, and every question asked to the assistant, each with the
 * visitor's IP and Cloudflare's approximate location and network.
 * GET /admin shows the log to whoever holds the ADMIN_TOKEN secret.
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

/* ── Visit log ─────────────────────────────────────────────────────── */

// Who is asking, as far as Cloudflare can tell. `org` is the network owner:
// usually an ISP, sometimes a company's own network.
function visitor(request) {
  const cf = request.cf || {};
  return {
    ip: request.headers.get('CF-Connecting-IP') || 'unknown',
    country: cf.country || null,
    region: cf.region || null,
    city: cf.city || null,
    org: cf.asOrganization || null,
  };
}

// Logging must never break the page or the chat, so failures only reach the logs.
async function logVisit(env, who, path, referrer, userAgent) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      'INSERT INTO visits (ip, country, region, city, org, path, referrer, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(who.ip, who.country, who.region, who.city, who.org, path, referrer, userAgent).run();
  } catch (err) {
    console.error('visit log failed', err);
  }
}

async function logQuestion(env, who, question) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      'INSERT INTO questions (ip, country, region, city, org, question) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(who.ip, who.country, who.region, who.city, who.org, question).run();
  } catch (err) {
    console.error('question log failed', err);
  }
}

async function handleVisit(request, env, ctx, origin) {
  let data = {};
  try {
    data = JSON.parse(await request.text());
  } catch {
    // An unreadable body still counts as a visit.
  }
  const path = String(data.path || '/').slice(0, 300);
  const referrer = String(data.referrer || '').slice(0, 500);
  const userAgent = (request.headers.get('User-Agent') || '').slice(0, 400);
  ctx.waitUntil(logVisit(env, visitor(request), path, referrer, userAgent));
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

async function authorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const given = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(env.ADMIN_TOKEN);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

async function handleAdminData(request, env) {
  const noStore = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (!env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Set the ADMIN_TOKEN secret first.' }), { status: 503, headers: noStore });
  }
  if (!(await authorized(request, env))) {
    return new Response(JSON.stringify({ error: 'Wrong password.' }), { status: 401, headers: noStore });
  }
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'No D1 database is bound as DB.' }), { status: 503, headers: noStore });
  }

  const since = (days) => `strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-${days} days')`;
  const [summary, visits, questions] = await env.DB.batch([
    env.DB.prepare(
      `SELECT
         (SELECT COUNT(*) FROM visits WHERE ts >= ${since(1)}) AS visits_24h,
         (SELECT COUNT(*) FROM visits WHERE ts >= ${since(7)}) AS visits_7d,
         (SELECT COUNT(DISTINCT ip) FROM visits WHERE ts >= ${since(7)}) AS visitors_7d,
         (SELECT COUNT(*) FROM questions WHERE ts >= ${since(7)}) AS questions_7d`
    ),
    env.DB.prepare('SELECT ts, ip, country, region, city, org, path, referrer, user_agent FROM visits ORDER BY id DESC LIMIT 300'),
    env.DB.prepare('SELECT ts, ip, country, region, city, org, question FROM questions ORDER BY id DESC LIMIT 200'),
  ]);

  return new Response(
    JSON.stringify({ summary: summary.results[0], visits: visits.results, questions: questions.results }),
    { status: 200, headers: noStore }
  );
}

// The page itself holds no data; it asks /admin/data with the password as a
// bearer token, and fills every cell with textContent because visitors control
// the referrer, user agent and question text.
const ADMIN_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Visitors · mengyig.github.io</title>
<style>
  :root{ --ground:#EFEDE7; --card:#fff; --ink:#141414; --ink-3:#77736A; --line:#DEDBD2; --marigold:#FFC12B; }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--ground); color:var(--ink); font:14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; }
  main{ max-width:1200px; margin:0 auto; padding:32px 20px 60px; }
  h1{ font-size:26px; margin:0 0 4px; letter-spacing:-.02em; }
  h2{ font-size:16px; margin:34px 0 12px; }
  .note{ color:var(--ink-3); margin:0 0 20px; }
  form{ display:flex; gap:8px; max-width:420px; }
  input{ flex:1; font:inherit; padding:10px 14px; border:1px solid var(--line); border-radius:99px; background:var(--card); }
  button{ font:inherit; font-weight:600; padding:10px 18px; border:1px solid var(--ink); border-radius:99px; background:var(--marigold); cursor:pointer; }
  .status{ color:var(--ink-3); margin-top:10px; min-height:1.5em; }
  .stats{ display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
  .stat{ background:var(--card); border:1px solid var(--line); border-radius:16px; padding:14px 16px; }
  .stat b{ display:block; font-size:26px; letter-spacing:-.02em; }
  .stat span{ color:var(--ink-3); font-size:12.5px; }
  .scroll{ overflow-x:auto; background:var(--card); border:1px solid var(--line); border-radius:16px; }
  table{ border-collapse:collapse; width:100%; min-width:900px; }
  th,td{ text-align:left; padding:9px 12px; border-bottom:1px solid var(--line); vertical-align:top; }
  th{ font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-3); background:#FAF9F6; position:sticky; top:0; }
  tr:last-child td{ border-bottom:0; }
  td.muted{ color:var(--ink-3); }
  td.wrap{ max-width:320px; overflow-wrap:anywhere; }
  .tag{ display:inline-block; font-size:11.5px; padding:1px 8px; border-radius:99px; background:#F1EFEA; color:var(--ink-3); }
  [hidden]{ display:none !important; }
</style>
</head>
<body>
<main>
  <h1>Visitors</h1>
  <p class="note">Times are Boston time. Location and network come from Cloudflare and are approximate; an IP address is a network, not a person.</p>
  <form id="login">
    <input id="password" type="password" placeholder="Admin password" autocomplete="current-password" required>
    <button type="submit">Show</button>
  </form>
  <p class="status" id="status"></p>

  <section id="data" hidden>
    <div class="stats" id="stats"></div>
    <h2>Questions asked to AI Mengyi</h2>
    <div class="scroll"><table><thead><tr><th>Time</th><th>Place</th><th>Network</th><th>IP</th><th>Question</th></tr></thead><tbody id="questions"></tbody></table></div>
    <h2>Page views</h2>
    <div class="scroll"><table><thead><tr><th>Time</th><th>Place</th><th>Network</th><th>IP</th><th>Page</th><th>Came from</th><th>Device</th></tr></thead><tbody id="visits"></tbody></table></div>
  </section>
</main>
<script>
  const $ = (id) => document.getElementById(id);
  const when = (ts) => new Date(ts).toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const place = (r) => [r.city, r.region, r.country].filter(Boolean).join(', ') || 'Unknown';
  const device = (ua) => {
    if (!ua) return 'Unknown';
    if (/bot|crawl|spider|slurp|preview|headless/i.test(ua)) return 'Bot';
    const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Other';
    const browser = /Edg\\//.test(ua) ? 'Edge' : /Chrome\\//.test(ua) ? 'Chrome' : /Firefox\\//.test(ua) ? 'Firefox' : /Safari\\//.test(ua) ? 'Safari' : 'Other';
    return os + ' · ' + browser;
  };
  const cell = (text, cls) => { const td = document.createElement('td'); td.textContent = text; if (cls) td.className = cls; return td; };
  const row = (cells) => { const tr = document.createElement('tr'); cells.forEach((c) => tr.appendChild(c)); return tr; };

  function render(data) {
    const s = data.summary || {};
    $('stats').replaceChildren(...[
      [s.visits_24h, 'page views, last 24 hours'],
      [s.visits_7d, 'page views, last 7 days'],
      [s.visitors_7d, 'different IPs, last 7 days'],
      [s.questions_7d, 'questions, last 7 days'],
    ].map(([n, label]) => {
      const div = document.createElement('div'); div.className = 'stat';
      const b = document.createElement('b'); b.textContent = n ?? 0;
      const span = document.createElement('span'); span.textContent = label;
      div.append(b, span); return div;
    }));

    $('questions').replaceChildren(...(data.questions.length ? data.questions.map((q) => row([
      cell(when(q.ts)), cell(place(q)), cell(q.org || 'Unknown', 'muted'), cell(q.ip, 'muted'), cell(q.question, 'wrap'),
    ])) : [row([cell('No questions yet.', 'muted')])]));

    $('visits').replaceChildren(...(data.visits.length ? data.visits.map((v) => row([
      cell(when(v.ts)), cell(place(v)), cell(v.org || 'Unknown', 'muted'), cell(v.ip, 'muted'),
      cell(v.path || '/'), cell(v.referrer || 'Direct', 'wrap muted'), cell(device(v.user_agent)),
    ])) : [row([cell('No visits yet.', 'muted')])]));

    $('data').hidden = false;
  }

  async function load(password) {
    $('status').textContent = 'Loading…';
    const res = await fetch('/admin/data', { headers: { Authorization: 'Bearer ' + password } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      $('status').textContent = data.error || 'Could not load the log.';
      sessionStorage.removeItem('adminPassword');
      return;
    }
    sessionStorage.setItem('adminPassword', password);
    $('status').textContent = 'Updated ' + when(new Date().toISOString()) + '.';
    render(data);
  }

  $('login').addEventListener('submit', (e) => { e.preventDefault(); load($('password').value); });
  const saved = sessionStorage.getItem('adminPassword');
  if (saved) load(saved);
</script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Admin: the dashboard page and its data, served from the Worker's own origin.
    if (request.method === 'GET' && pathname === '/admin') {
      return new Response(ADMIN_PAGE, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
      });
    }
    if (request.method === 'GET' && pathname === '/admin/data') {
      return handleAdminData(request, env);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Use POST.' }, 405, origin);
    }
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return json({ error: 'Origin not allowed.' }, 403, origin);
    }

    if (pathname === '/visit') {
      // Only pages on the site report views; a bare request without an Origin is ignored.
      if (!origin) return new Response(null, { status: 204 });
      return handleVisit(request, env, ctx, origin);
    }
    if (pathname !== '/') {
      return json({ error: 'Not found.' }, 404, origin);
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

    ctx.waitUntil(logQuestion(env, visitor(request), messages[messages.length - 1].content));

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
