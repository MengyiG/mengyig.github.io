/* chat.js: the AI assistant panel.
   Talks to a Cloudflare Worker that holds the API key; the key never reaches the browser.
   Until ENDPOINT is set, the panel stays open but says so instead of pretending. */

(function () {
  'use strict';

  const CONFIG = {
    ENDPOINT: 'https://ai-mengyi.cold-poetry-98af.workers.dev',
    MAX_TURNS: 10,
  };

  const P = window.PROFILE || PROFILE;
  const $ = (sel) => document.querySelector(sel);

  const chat = $('#chat');
  const log = $('#chatLog');
  const chips = $('#chatChips');
  const form = $('#chatForm');
  const input = $('#chatInput');

  /* ── "This is me": opening the site once with ?me marks this browser as the
     owner's, so the visit log keeps its visits and questions apart. ?me=off
     clears the mark. The parameter is removed from the address bar either way. ── */
  const ME_KEY = 'mengyi-me';
  let isMe = false;
  try {
    const params = new URLSearchParams(location.search);
    if (params.has('me')) {
      if (params.get('me') === 'off') localStorage.removeItem(ME_KEY);
      else localStorage.setItem(ME_KEY, '1');
      params.delete('me');
      const query = params.toString();
      // window.history: this file has its own `history` (the chat log) further down.
      window.history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
    }
    isMe = localStorage.getItem(ME_KEY) === '1';
  } catch (err) {
    // Storage can be blocked; the visit is then logged like any other.
  }

  /* ── Visit log: one beacon per page view; the Worker adds IP and location.
     Plain text keeps it a simple request with no CORS preflight. Skipped on
     localhost so local previews stay out of the log. ── */
  if (CONFIG.ENDPOINT && !['localhost', '127.0.0.1'].includes(location.hostname)) {
    fetch(CONFIG.ENDPOINT + '/visit', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ path: location.pathname + location.hash, referrer: document.referrer, me: isMe }),
    }).catch(() => {});
  }

  let history = [];
  let busy = false;
  let lastFocus = null;

  /* ── Open / close ── */
  function open() {
    lastFocus = document.activeElement;
    chat.hidden = false;
    if (!log.children.length) greet();
    setTimeout(() => input.focus(), 60);
  }

  function close() {
    chat.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', open));
  document.querySelectorAll('[data-ask]').forEach((b) => b.addEventListener('click', () => {
    open();
    send(b.dataset.ask);
  }));
  /* The hero ask box: whatever is typed there becomes the first message. */
  const heroAsk = $('#heroAsk');
  if (heroAsk) heroAsk.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = heroAsk.q.value.trim();
    if (!text) {
      heroAsk.q.focus();
      return;
    }
    heroAsk.reset();
    open();
    send(text);
  });
  document.querySelectorAll('[data-close-chat]').forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chat.hidden) close();
  });

  /* ── Messages ── */
  function bubble(text, who) {
    const el = document.createElement('div');
    el.className = 'msg msg-' + who;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function note(html) {
    const el = document.createElement('div');
    el.className = 'msg msg-note';
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function thinking() {
    const el = document.createElement('div');
    el.className = 'msg msg-ai';
    el.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function greet() {
    bubble(
      'Hi, I am ' + P.ai.displayName + ', the AI version of ' + P.identity.name.split(' ')[0] +
      '. I know my CV, projects and notes, so ask me anything about my work.',
      'ai'
    );
    P.ai.suggestedQuestions.forEach((q) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', () => {
        chips.hidden = true;
        send(q);
      });
      chips.appendChild(b);
    });
  }

  /* ── Sending ── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) send(text);
  });

  async function send(text) {
    if (busy) return;
    chips.hidden = true;
    input.value = '';
    bubble(text, 'me');

    // "How can I reach you?" and similar: hand off to the real form rather than fake it.
    if (/\b(email|contact|reach|get in touch|message you)\b/i.test(text) && text.length < 60) {
      note('Opening the contact form. That goes straight to my inbox.');
      setTimeout(() => {
        close();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('#contactForm input[name="name"]').focus();
      }, 900);
      return;
    }

    if (!CONFIG.ENDPOINT) {
      note(
        'My brain is not wired up yet. ' +
        'In the meantime the page below has the real answers, or ' +
        '<a href="#contact">send me a message</a>.'
      );
      return;
    }

    busy = true;
    const dots = thinking();
    history.push({ role: 'user', content: text });

    try {
      const res = await fetch(CONFIG.ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-CONFIG.MAX_TURNS * 2), me: isMe }),
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const reply = (data.reply || '').trim();
      if (!reply) throw new Error('Empty reply');

      dots.textContent = reply;
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      dots.remove();
      note(
        'Something went wrong on my side. You can ' +
        '<a href="#contact">message me directly</a> instead.'
      );
    } finally {
      busy = false;
      log.scrollTop = log.scrollHeight;
    }
  }
})();
