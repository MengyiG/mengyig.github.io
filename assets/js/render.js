/* render.js — paints every section from PROFILE. No content lives in the markup. */

(function () {
  'use strict';

  const P = window.PROFILE || PROFILE;
  const $ = (sel) => document.querySelector(sel);
  const slot = (name) => document.querySelector('[data-bind="' + name + '"]');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function fill(name, html) {
    const el = slot(name);
    if (el) el.innerHTML = html;
  }

  /* ── Hero ── */
  const greet = P.identity.greeting;
  fill('greeting',
    esc(greet[0]) + ', ' + esc(greet[1]) + ', <span class="zh">' + esc(greet[2]) + '</span>'
  );
  fill('role-line', esc(P.identity.role) + ' · ' + esc(P.identity.company.name));

  /* Link the employer's name wherever it appears in the intro copy. */
  const co = P.identity.company;
  const linkCompany = (text) => esc(text).replace(
    esc(co.name),
    '<a class="inline-link" href="' + esc(co.url) + '" target="_blank" rel="noopener">' + esc(co.name) + '</a>'
  );
  fill('intro', linkCompany(P.intro.long));
  fill('intro-short', linkCompany(P.intro.short));
  fill('location', esc(P.identity.location));
  fill('tags', P.tags.map((t) =>
    '<li' + (t.primary ? ' class="is-primary"' : '') + '>' + esc(t.label) + '</li>'
  ).join(''));

  const avatar = slot('avatar');
  if (avatar) {
    avatar.src = P.identity.avatar;
    if (P.identity.avatarPosition) avatar.style.objectPosition = P.identity.avatarPosition;
  }

  /* Speech bubbles around the mascot — each opens the chat with that question. */
  fill('mascot-prompts', (P.ai.mascotPrompts || []).map((q) =>
    '<button class="prompt-bubble" type="button" data-ask="' + esc(q) + '">' + esc(q) + '</button>'
  ).join(''));

  /* ── Marquee: every tool, looped twice so the scroll is seamless ── */
  const allTools = P.tools.groups.reduce((acc, g) => acc.concat(g.items), []);
  const bandRun = allTools.map((t) => '<span>' + esc(t) + '</span>').join('');
  fill('band', bandRun + bandRun);

  /* ── Philosophy ── */
  const lead = P.philosophy.lead;
  const leadParts = lead.split('help solve problems');
  fill('philosophy-lead', leadParts.length === 2
    ? esc(leadParts[0]) + '<em>help solve problems</em>' + esc(leadParts[1])
    : esc(lead));
  const philTint = ['', ' is-marigold', ' is-blossom'];
  fill('philosophy-points', P.philosophy.points.map((pt, i) =>
    '<article class="card' + philTint[i % philTint.length] + '">' +
      '<h3>' + esc(pt.title) + '</h3>' +
      '<p>' + esc(pt.body) + '</p>' +
    '</article>'
  ).join(''));

  fill('recommendations', P.recommendations.map((r) =>
    '<figure class="quote">' +
      '<blockquote>' + esc(r.quote) + '</blockquote>' +
      '<figcaption>' +
        '<span class="who">' + esc(r.author) + '</span>' +
        '<span class="what">' + esc(r.title) + '</span>' +
      '</figcaption>' +
    '</figure>'
  ).join(''));

  /* ── Tools & trends ── */
  fill('tool-groups', P.tools.groups.map((g) =>
    '<div class="tool-group">' +
      '<h3>' + esc(g.group) + '</h3>' +
      '<div class="chips">' + g.items.map((i) => '<span>' + esc(i) + '</span>').join('') + '</div>' +
    '</div>'
  ).join(''));

  fill('trends', P.tools.trends.map((t) =>
    '<article class="card">' +
      '<h3>' + esc(t.name) + '</h3>' +
      '<p>' + esc(t.note) + '</p>' +
    '</article>'
  ).join(''));

  /* ── Projects ── */
  const TINTS = ['tint-a', 'tint-b', 'tint-c', 'tint-d', 'tint-e'];
  const projects = P.projects.slice().sort((a, b) => b.year - a.year);
  fill('projects', projects.map((p, i) => {
    const link = p.private
      ? '<span class="card-link" style="opacity:.55">Private repo</span>'
      : '<a class="card-link" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View on GitHub →</a>';
    return '<article class="card proj-card ' + TINTS[i % TINTS.length] + '">' +
      '<div class="proj-head">' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<span class="proj-year">' + esc(p.year) + '</span>' +
      '</div>' +
      '<div class="proj-stack">' + p.stack.map((s) => '<span>' + esc(s) + '</span>').join('') + '</div>' +
      '<p>' + esc(p.blurb) + '</p>' +
      link +
    '</article>';
  }).join(''));

  /* ── Journey ── */
  fill('work', P.work.map((j) => {
    const company = j.companyUrl
      ? '<a href="' + esc(j.companyUrl) + '" target="_blank" rel="noopener">' + esc(j.company) + '</a>'
      : esc(j.company);
    return '<article class="job">' +
      '<div class="job-when">' +
        (j.current ? '<span class="job-badge">Current</span><br>' : '') +
        esc(j.period) + '<br>' + esc(j.location) +
      '</div>' +
      '<div>' +
        '<h3>' + esc(j.role) + '</h3>' +
        '<p class="job-co">' + company + '</p>' +
        '<p class="job-sum">' + esc(j.webSummary) + '</p>' +
        '<div class="job-stack">' + j.stack.map((s) => '<span>' + esc(s) + '</span>').join('') + '</div>' +
      '</div>' +
    '</article>';
  }).join(''));

  /* ── Education ── */
  const crest = (item, cls) => item.logo
    ? '<img class="' + cls + '" src="' + esc(item.logo) + '" alt="">'
    : '<span class="' + cls + '" style="background:' + esc(item.color || '#141414') + '">' + esc(item.mark || '') + '</span>';

  fill('education', P.education.map((e) =>
    '<article class="card edu-card">' +
      crest(e, 'crest') +
      '<span class="edu-text">' +
        '<span class="deg">' + esc(e.degree) + '</span>' +
        '<span class="school">' + esc(e.school) + '</span>' +
        '<span class="when">' + esc(e.period) + ' · GPA ' + esc(e.gpa) + '</span>' +
      '</span>' +
    '</article>'
  ).join(''));

  fill('certifications', P.certifications.map((c) =>
    '<li>' +
      crest(c, 'cert-mark') +
      '<span class="cert-text">' +
        '<span class="name">' + esc(c.name) + '</span>' +
        '<span class="meta">' + esc(c.issuer) + (c.date ? ' · ' + esc(c.date) : '') + '</span>' +
      '</span>' +
    '</li>'
  ).join(''));

  /* ── Fun facts ── */
  fill('fun-facts', P.funFacts.map((f) =>
    '<article class="fun-card">' +
      '<img src="' + esc(f.image) + '" alt="" loading="lazy"' +
        (f.imagePosition ? ' style="object-position:' + esc(f.imagePosition) + '"' : '') + '>' +
      '<div class="fun-body">' +
        '<span class="fun-emoji">' + esc(f.emoji) + '</span>' +
        '<h3>' + esc(f.title) + '</h3>' +
        '<p>' + esc(f.body) + '</p>' +
      '</div>' +
    '</article>'
  ).join(''));

  /* ── Contact ── */
  const c = P.contact;

  const ICONS = {
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013-.405c1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  };

  const socialLink = (key, label, url) => url
    ? '<li><a href="' + esc(url) + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICONS[key] + '"/></svg>' +
        esc(label) +
      '</a></li>'
    : '';

  fill('contact-links',
    socialLink('linkedin', 'LinkedIn', c.linkedin) +
    socialLink('github', 'GitHub', c.github) +
    socialLink('youtube', 'YouTube', c.youtube)
  );

  /* ── Footer ── */
  fill('footer-name', '© ' + new Date().getFullYear() + ' ' + esc(P.identity.name));
  fill('footer-meta', 'Built from one data file · updated ' + esc(P.meta.updated));

  /* ── Chat header ── */
  fill('chat-name', esc(P.ai.displayName));
  fill('chat-status', esc(P.ai.tagline));
  const chatAvatar = slot('chat-avatar');
  if (chatAvatar) chatAvatar.src = P.identity.avatar;

  document.title = P.identity.name + ' — ' + P.identity.role;

  /* ── Nav shadow on scroll ── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Contact form → Web3Forms ── */
  const form = $('#contactForm');
  const status = $('#formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';

    if (!form.checkValidity()) {
      status.textContent = 'Please fill in your name, a valid email, and a message.';
      status.classList.add('is-err');
      return;
    }

    if (!c.formAccessKey) {
      status.textContent = 'The form is not connected yet — email ' + c.email + ' in the meantime.';
      status.classList.add('is-err');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = 'Sending…';

    const body = new FormData(form);
    body.append('access_key', c.formAccessKey);
    body.append('subject', 'New message from mengyig.github.io');
    body.append('from_name', 'mengyig.github.io');

    try {
      const res = await fetch(c.formEndpoint, { method: 'POST', body });
      const data = await res.json();
      if (data.success) {
        form.reset();
        status.textContent = 'Sent. I will get back to you soon.';
        status.classList.add('is-ok');
      } else {
        throw new Error(data.message || 'Send failed');
      }
    } catch (err) {
      status.textContent = 'That did not go through. Email ' + c.email + ' instead.';
      status.classList.add('is-err');
    } finally {
      btn.disabled = false;
    }
  });
})();
