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
  fill('intro', esc(P.intro.long));
  fill('intro-short', esc(P.intro.short));
  fill('location', esc(P.identity.location));
  fill('tags', P.tags.map((t) =>
    '<li' + (t.primary ? ' class="is-primary"' : '') + '>' + esc(t.label) + '</li>'
  ).join(''));

  const avatar = slot('avatar');
  if (avatar) avatar.src = P.identity.avatar;

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
  const projects = P.projects.slice().sort((a, b) => b.year - a.year);
  const years = projects.map((p) => p.year);
  fill('projects-count', projects.length + ' repos · ' + Math.min.apply(null, years) + '–' + Math.max.apply(null, years));
  fill('projects', projects.map((p) => {
    const link = p.private
      ? '<span class="card-link" style="color:var(--ink-3)">Private repo</span>'
      : '<a class="card-link" href="' + esc(p.repo) + '" target="_blank" rel="noopener">View on GitHub →</a>';
    return '<article class="card">' +
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
  fill('education', P.education.map((e) =>
    '<article class="card edu-card">' +
      '<span class="deg">' + esc(e.degree) + '</span>' +
      '<span class="school">' + esc(e.school) + '</span>' +
      '<span class="when">' + esc(e.period) + ' · GPA ' + esc(e.gpa) + '</span>' +
    '</article>'
  ).join(''));

  fill('certifications', P.certifications.map((c) =>
    '<li>' +
      '<span class="name">' + esc(c.name) + '</span>' +
      '<span class="meta">' + esc(c.issuer) + (c.date ? ' · ' + esc(c.date) : '') + '</span>' +
    '</li>'
  ).join(''));

  /* ── Fun facts ── */
  fill('fun-facts', P.funFacts.map((f) =>
    '<article class="fun-card">' +
      '<img src="' + esc(f.image) + '" alt="" loading="lazy">' +
      '<div class="fun-body">' +
        '<span class="fun-emoji">' + esc(f.emoji) + '</span>' +
        '<h3>' + esc(f.title) + '</h3>' +
        '<p>' + esc(f.body) + '</p>' +
      '</div>' +
    '</article>'
  ).join(''));

  /* ── Contact ── */
  const c = P.contact;
  fill('contact-links',
    '<li><a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>' +
    '<li><a href="' + esc(c.github) + '" target="_blank" rel="noopener">GitHub</a></li>' +
    (c.youtube ? '<li><a href="' + esc(c.youtube) + '" target="_blank" rel="noopener">YouTube</a></li>' : '')
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
