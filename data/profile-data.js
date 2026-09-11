/**
 * profile-data.js — single source of truth for mengyig.github.io
 *
 * Everything on the site renders from this file. Nothing is hardcoded in markup.
 * The AI assistant on the site is also grounded in this file, so a fact only
 * has to be corrected in one place.
 *
 * Intended downstream consumers (not built yet):
 *   - the website (this repo)
 *   - the GitHub profile README (MengyiG/mengyig)
 *   - the CVs (MengyiG/cv → cv-data.js)
 *
 * Fields marked NEEDS_CONFIRM disagree between the existing sources.
 */

const PROFILE = {

  meta: {
    updated: '2026-09-11',
    siteTitle: 'Mengyi Guo',
    siteDescription: 'Full-stack developer building distributed backends and the cloud infrastructure under them.',
  },

  /* ── Identity ──────────────────────────────────────────────────── */
  identity: {
    name: 'Mengyi Guo',
    greeting: ['Hi', 'Bonjour', '你好'],
    role: 'Full Stack Developer',
    company: { name: 'SimWell', url: 'https://www.simwell.io/' },

    location: 'Boston, MA',

    headline: 'I ship systems, and I explain them.',
    avatar: 'images/portrait.jpg',
    // object-position for the hero crop — she stands right of centre in this frame.
    avatarPosition: '76% 42%',
  },

  /* ── Contact ───────────────────────────────────────────────────── */
  contact: {
    email: 'mengyi.guo.dev@gmail.com',

    // No phone number here on purpose: this file is served publicly at
    // /data/profile-data.js, so anything in it is readable by anyone.
    // The phone number lives only in the private cv repo.

    linkedin: 'https://www.linkedin.com/in/mengyi-guo/',
    github: 'https://github.com/MengyiG',
    youtube: 'https://www.youtube.com/@Lea-pe7jy',

    // Web3Forms access key — set after signing up; the key is safe to expose publicly.
    formEndpoint: 'https://api.web3forms.com/submit',
    formAccessKey: '',
  },

  /* ── Hero tags ─────────────────────────────────────────────────── */
  tags: [
    { label: 'Backend', primary: true },
    { label: 'DevOps & Cloud', primary: true },
    { label: 'Java 17 · Spring Boot' },
    { label: 'Azure AKS' },
    { label: 'Terraform · Flux' },
    { label: 'EN · FR · 中文' },
  ],

  /* ── Intro copy ────────────────────────────────────────────────── */
  intro: {
    short: 'Full-stack developer at SimWell. I build distributed backends on Java and Spring Boot, then run them on Azure Kubernetes with Terraform and Flux.',
    long: 'Full-stack developer at SimWell, where I am the primary engineer across the whole platform — backend services, the cloud infrastructure under them, testing, operations, and talking to clients directly. I came to engineering from language teaching: I hold a master\'s in Second Language Education from McGill and worked as a certified English–Mandarin interpreter before a second master\'s in Information Technology at Virginia Tech.',
  },

  /* ── My philosophy ─────────────────────────────────────────────── */
  philosophy: {
    lead: 'Collaborate, share, and help solve problems.',
    points: [
      {
        title: 'Write it down',
        body: 'Two years of interpreting taught me that a thing you cannot explain simply, you do not understand yet. I write the design doc before the code, and the runbook before the incident.',
      },
      {
        title: 'Own the whole path',
        body: 'I would rather understand a feature from the API contract to the Terraform module that gives it a DNS record than hand it over at a boundary and hope.',
      },
      {
        title: 'Boring where it counts',
        body: 'Zero secrets in code, reproducible environments, tests that spin up real dependencies. Save the cleverness for the problem, not the plumbing.',
      },
    ],
  },

  /* ── Tools & trends ────────────────────────────────────────────── */
  tools: {
    groups: [
      { group: 'Languages', items: ['Java 17', 'Python 3', 'TypeScript', 'Bash', 'SQL'] },
      { group: 'Backend', items: ['Spring Boot 3.5', 'Spring Cloud', 'RabbitMQ', 'PostgreSQL', 'TestContainers'] },
      { group: 'Cloud — Azure', items: ['AKS', 'Key Vault', 'Blob Storage', 'Azure AD', 'ACR', 'PostgreSQL Flexible Server'] },
      { group: 'Infrastructure', items: ['Terraform', 'Flux v2', 'Kustomize', 'Helm', 'Docker', 'Gateway API'] },
      { group: 'Observability', items: ['OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana', 'Log Analytics'] },
    ],
    // What I am actively following right now — this is the part that should change often.
    trends: [
      { name: 'Agentic coding', note: 'Building with the Anthropic Java SDK at work; running Claude Code on my own projects daily.' },
      { name: 'RAG evaluation', note: 'Less about retrieval tricks, more about how you know the answer was right.' },
      { name: 'MCP', note: 'Model Context Protocol servers as the clean way to give a model real tools.' },
      { name: 'Platform engineering', note: 'GitOps all the way down — if it is not in the repo, it does not exist.' },
    ],
  },

  /* ── Projects ──────────────────────────────────────────────────── */
  projects: [
    {
      name: 'myRAGPlayground',
      repo: 'https://github.com/MengyiG/myRAGPlayground',
      year: 2026,
      stack: ['Python', 'RAG', 'Embeddings'],
      blurb: 'Retrieval experiments on my own documents — chunking strategies, embedding choices, and a harness for judging whether the answers actually improved.',
      featured: true,
    },
    {
      name: 'trac75-floorplan-watcher',
      repo: 'https://github.com/MengyiG/trac75-floorplan-watcher',
      year: 2026,
      stack: ['Python', 'Automation'],
      blurb: 'A watcher that pings me when a floor plan I want comes back on the market. Built because refreshing a listings page by hand is a job for a computer.',
      featured: true,
      private: true,
    },
    {
      name: 'MyChatroomHub',
      repo: 'https://github.com/MengyiG/MyChatroomHub',
      year: 2024,
      stack: ['Spring Boot', 'WebSocket'],
      blurb: 'Real-time chatroom with presence, rooms and message history.',
      featured: true,
    },
    {
      name: 'MyDockerApp',
      repo: 'https://github.com/MengyiG/MyDockerApp',
      year: 2023,
      stack: ['Docker', 'CI/CD'],
      blurb: 'Containerised service with an end-to-end build and deploy pipeline.',
    },
  ],

  /* ── Journey: work ─────────────────────────────────────────────── */
  work: [
    {
      role: 'Full Stack Developer',
      company: 'SimWell',
      companyUrl: 'https://www.simwell.io/',
      period: 'Aug 2024 – Present',
      start: '2024-08',
      end: null,
      location: 'Remote',
      current: true,
      stack: ['Java 17', 'Spring Boot 3.5', 'RabbitMQ', 'Azure AKS', 'Terraform', 'Flux v2', 'OpenTelemetry'],
      webSummary: 'Primary engineer on the Compass platform — a multi-module Spring Boot microservice estate on Java 17, running on private Azure Kubernetes clusters that I provision with Terraform and deploy with Flux v2 GitOps. I own it end to end: backend, infrastructure, tests, operations, and the client conversations.',
      bullets: [
        'Served as the primary engineer across the full Compass platform lifecycle — owning backend development, cloud infrastructure, testing, operations, and direct client-facing technical communication end-to-end.',
        'Designed and maintained a multi-module Spring Boot 3.5 microservices platform (Auth, Simulation, AI services) on Java 17 and Spring Cloud across local, dev, staging, demo, and production environments.',
        'Engineered asynchronous job dispatch using RabbitMQ and Spring AMQP, enabling decoupled simulation execution via Java-native and Python-script workers deployed as Kubernetes Jobs.',
        'Integrated Azure cloud services: Azure Active Directory (OAuth2/JWT), Blob Storage, Azure Communication Services, and Key Vault for zero-secret-in-code credential management.',
        'Implemented end-to-end distributed tracing with OpenTelemetry and Jaeger, providing request-level visibility across all microservices.',
        'Built a TestContainers integration test suite (PostgreSQL, RabbitMQ, Azurite, K3s) enabling fully isolated, reproducible tests, with Maven Surefire configured for parallel execution.',
        'Designed and maintained Terraform infrastructure-as-code across two Azure subscription tiers, provisioning AKS clusters, PostgreSQL Flexible Servers, VNets, Private Endpoints, ACR, Key Vault and VPN Gateway as reusable parameterised modules.',
        'Implemented Flux v2 GitOps pipelines with Kustomize overlays for declarative, drift-free Kubernetes deployments across dev and demo clusters.',
        'Enforced zero-trust networking and secret hygiene: all credentials in Key Vault, ACR and PostgreSQL on private endpoints, AKS private FQDN, developer access via IP allowlisting and Point-to-Site VPN.',
        'Configured Azure Workload Identity for pod-level authentication, eliminating long-lived credentials by federating Kubernetes service accounts with Azure Managed Identities.',
        'Automated TLS and DNS with cert-manager (Let\'s Encrypt DNS-01 via Azure DNS) and External DNS, reducing new-service endpoint setup to a single manifest.',
        'Designed a blue-green PostgreSQL migration pattern using Azure Flexible Server Point-in-Time Restore, enabling zero-downtime schema migrations in production.',
        'Contributed to the AI service module integrating the Anthropic Java SDK, enabling LLM-powered features within the platform.',
      ],
    },
    {
      role: 'Software Engineer Intern',
      company: 'CIBC',
      period: 'Jan 2023 – Apr 2023',
      start: '2023-01',
      end: '2023-04',
      location: 'Toronto, ON, Canada',
      current: false,
      stack: ['Java', 'Spring Boot', 'Splunk', 'OpenShift'],
      webSummary: 'Built eBanking payment features (Costco Business Card, Smart Planner) in an enterprise Spring Boot codebase, and worked production support — roughly three live issues a week, traced through Splunk and OpenShift.',
      bullets: [
        'Translated business requirements into technical specifications in Java; developed product features (Costco Business Card, Smart Planner) in an enterprise Spring Boot project, from requirement gathering to production support.',
        'Leveraged Splunk and Red Hat OpenShift to examine logs and performance data, debugging across thousands of transactions to investigate production issues.',
        'Analyzed HTTP request payloads, JSON and XML files to provide operational support, resolving approximately 3 production issues per week.',
      ],
    },
    {
      role: 'Software Engineer Intern',
      company: 'CAE',
      period: 'Sep 2022 – Dec 2022',
      start: '2022-09',
      end: '2022-12',
      location: 'Montreal, QC, Canada',
      current: false,
      stack: ['C++', 'BullseyeCoverage'],
      webSummary: 'Took a simulation component from zero test coverage to over 80% with C++ test scripts, and wrote the 120+ pages of documentation that let the next person keep it there.',
      bullets: [
        'Collaborated with fellow interns to develop C++ testing scripts validating software functionality; enhanced test coverage from 0% to over 80% using BullseyeCoverage.',
        'Worked with developers to refine testing specifications and generated 120+ pages of technical documentation including test plans, data analysis, flow charts and tracking mechanisms.',
      ],
    },
    {
      role: 'Interpreter & language educator',
      company: 'Independent · Kells Academy · ILAC',
      period: '2015 – 2021',
      start: '2015',
      end: '2021',
      location: 'Montreal, QC, Canada',
      current: false,
      priorCareer: true,
      stack: ['EN ⇄ 中文', 'Teaching', 'Accounting ops'],
      webSummary: 'Certified English–Mandarin interpreter in China, then language teaching and school administration in Montreal. The part of my résumé that most shapes how I work: if I cannot explain it, I do not understand it yet.',
      bullets: [],
    },
  ],

  /* ── Education ─────────────────────────────────────────────────── */
  /* `mark` + `color` draw a typographic crest rather than the school's official
     logo — university marks are trademarked and licensed. Swap in a real crest
     by adding `logo: 'images/vt.png'` if you get permission or an official asset. */
  education: [
    {
      degree: 'M.S. Information Technology',
      school: 'Virginia Tech',
      period: 'Aug 2021 – Dec 2023',
      gpa: '4.0 / 4.0',
      mark: 'VT',
      color: '#861F41',
    },
    {
      degree: 'M.A. Second Language Education',
      school: 'McGill University',
      period: 'Sep 2015 – Jun 2017',
      gpa: '3.8 / 4.0',
      mark: 'MCGILL',
      color: '#ED1B2F',
    },
  ],

  /* AWS and Azure use the official Credly badges issued to Mengyi. The other two
     fall back to a typographic mark. */
  certifications: [
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'March 2024', logo: 'images/aws-badge.png' },
    { name: 'Microsoft Azure Fundamentals (AZ-900)', issuer: 'Microsoft', date: 'February 2024', logo: 'images/azure-badge.png' },
    { name: 'Software Development Certificate', issuer: 'Virginia Tech', date: 'June 2023', mark: 'VT', color: '#861F41' },
    { name: 'Certified English–Mandarin Interpreter', issuer: 'China', date: '', mark: '文', color: '#4C6FF5' },
  ],

  /* ── Fun facts ─────────────────────────────────────────────────── */
  funFacts: [
    {
      emoji: '🌭',
      title: 'One dachshund',
      body: 'Yes, she is a sausage dog. She supervises every deploy from the desk chair.',
      image: 'images/dog.jpg',
    },
    {
      emoji: '🥑',
      title: '60+ avocado plants',
      body: 'Grown from pits. Most of them will never fruit in Canada and I keep going anyway.',
      image: 'images/plants.jpg',
    },
    {
      emoji: '🔊',
      title: 'Three languages',
      body: 'English, French and Mandarin — and a certification that says I can switch between two of them live, under pressure.',
      image: 'images/curious.jpg',
    },
    {
      emoji: '🎙',
      title: 'A podcast queue that never empties',
      body: 'When I disconnect from the social network, I reconnect with podcasts.',
      image: 'images/coffee.jpg',
      imagePosition: 'center 20%',
    },
  ],

  gallery: [
    { src: 'images/garden.jpg', alt: 'In the garden' },
    { src: 'images/beach.jpg', alt: 'By the beach' },
    { src: 'images/winter.jpg', alt: 'Montreal winter' },
    { src: 'images/smile.jpg', alt: 'Outside' },
    { src: 'images/rabbit.jpg', alt: 'Rabbit' },
  ],

  /* ── What colleagues said ──────────────────────────────────────── */
  /* Excerpts from LinkedIn recommendations. The "and more" link sends readers
     to the full list rather than reproducing all of them here. */
  recommendationsUrl: 'https://www.linkedin.com/in/mengyi-guo/details/recommendations/',
  recommendations: [
    {
      quote: 'She is hard-working and professional, consistently taking initiative and learning new things to bring back to the team. She is also always ready to help or teach anyone who needs it.',
      author: 'Loïs Garcion',
      title: 'Fullstack Software Engineer · Java, Cloud & DevOps',
      relation: 'co-worker',
    },
    {
      quote: 'Her proactive nature truly stood out when she took the initiative to assist me in Dockerizing our application, showcasing not only her technical skills but also her willingness to collaborate and support her team.',
      author: 'Olivia Kim',
      title: 'Equity Derivatives IT · Google Cloud & AWS Certified Architect',
      relation: 'co-worker',
    },
    {
      quote: 'Mengyi is one of the best teammates I had in Virginia Tech\'s MIT program. I noticed her eye for detail, team spirit, and objectivity in every assignment during the period I worked with her.',
      author: 'Sabrina Ahmed',
      title: 'Software Test Automation Engineer',
      relation: 'classmate',
    },
    {
      quote: 'I was immediately impressed by her remarkable initiative to learn and grow professionally. Her dedication to continuous learning was not confined to our work hours.',
      author: 'Minfeng Xu',
      title: 'Application Developer, CIBC',
      relation: 'co-worker',
    },
    {
      quote: 'She is always keen to learn new technologies and can always complete tasks on time. I am impressed by her work ethic and communication skills.',
      author: 'Ran Shang',
      title: 'Online Programmer, Ubisoft',
      relation: 'co-worker',
    },
  ],

  /* ── AI assistant ──────────────────────────────────────────────── */
  /* The assistant is grounded in everything above. This block only holds
     what the data itself cannot express: tone, boundaries, and openers. */
  ai: {
    displayName: 'AI Mengyi',
    tagline: 'Ask me anything — I answer 24/7.',
    persona: 'Answer as Mengyi in the first person: direct, warm, specific. Prefer concrete detail over adjectives. It is fine to say you do not know.',
    boundaries: [
      'Never state a salary expectation, notice period, or visa status — offer to pass the question to the real Mengyi instead.',
      'Do not invent projects, employers, dates, or metrics that are not in this file.',
      'Keep answers under roughly 120 words unless asked to go deeper.',
    ],
    // Shown as speech bubbles around the mascot on the hero.
    mascotPrompts: [
      'Is she a good teammate?',
      'Tell me a fun fact',
    ],
    suggestedQuestions: [
      'What does she actually build?',
      'Backend or DevOps?',
      'Is she a good teammate?',
      'Tell me a fun fact',
      'Email her for me',
    ],
    handoff: 'If someone wants to reach the real Mengyi, point them at the contact form rather than the email address.',
  },
};

/* Top-level `const` in a classic script is not a window property, so expose it. */
if (typeof window !== 'undefined') { window.PROFILE = PROFILE; }
if (typeof module !== 'undefined') { module.exports = PROFILE; }
