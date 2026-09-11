/* chat.js: the AI assistant panel.
   Talks to a Cloudflare Worker that holds the API key; the key never reaches the browser.
   Until ENDPOINT is set, the panel stays open but says so instead of pretending. */

(function () {
  'use strict';

  const CONFIG = {
    // Set this to your deployed Worker URL, e.g. https://ai-mengyi.<subdomain>.workers.dev
    ENDPOINT: '',
    MAX_TURNS: 10,
  };

  const P = window.PROFILE || PROFILE;
  const $ = (sel) => document.querySelector(sel);

  const chat = $('#chat');
  const log = $('#chatLog');
  const chips = $('#chatChips');
  const form = $('#chatForm');
  const input = $('#chatInput');

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
      'Hi, I am ' + P.ai.displayName + ', an AI trained on ' + P.identity.name.split(' ')[0] +
      "'s CV, projects and notes. Ask me anything about her work.",
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

    // "Email her for me" and similar: hand off to the real form rather than fake it.
    if (/\b(email|contact|reach|get in touch|message her)\b/i.test(text) && text.length < 60) {
      note('Opening the contact form. That goes straight to her inbox.');
      setTimeout(() => {
        close();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        document.querySelector('#contactForm input[name="name"]').focus();
      }, 900);
      return;
    }

    if (!CONFIG.ENDPOINT) {
      note(
        'My brain is not wired up yet. Mengyi is still deploying it. ' +
        'In the meantime the page below has the real answers, or ' +
        '<a href="#contact">send her a message</a>.'
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
        body: JSON.stringify({ messages: history.slice(-CONFIG.MAX_TURNS * 2) }),
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
        '<a href="#contact">message Mengyi directly</a> instead.'
      );
    } finally {
      busy = false;
      log.scrollTop = log.scrollHeight;
    }
  }
})();
