/**
 * profile-data.js: single source of truth for mengyig.github.io
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
    // Shown in the footer. The Worker logs page views and chat questions with IP and approximate location.
    privacyNote: 'This site logs visits and questions asked to AI Mengyi, with IP address and approximate location.',
  },

  /* ── Identity ──────────────────────────────────────────────────── */
  identity: {
    name: 'Mengyi Guo',
    /* A welcome, not a language claim. The languages she actually works in are
       stated in `tags` below (EN · 中文). `color` is optional per word. */
    greeting: [
      { text: 'Hi' },
      { text: 'Hola', color: '#D6431B' },
      { text: 'Bonjour' },
      { text: '你好', color: '#4C6FF5' },
    ],
    role: 'Full Stack Developer',
    company: { name: 'SimWell', url: 'https://www.simwell.io/' },

    location: 'Boston, MA',
    // Where I am from and where I have lived, for "where are you from?" questions.
    origin: 'China',
    livedIn: [
      { place: 'Montréal, QC', from: '2015', to: '2021', note: 'Moved abroad in 2015 to study at McGill.' },
      { place: 'Toronto, ON', from: '2021', to: '2026' },
      { place: 'Boston, MA', from: '2026-08', to: null, note: 'Moved in August 2026.' },
    ],
    // Shown on the site and CV, and stated by the assistant. No document type or dates.
    workAuthorization: { text: 'Authorized to work in the U.S.', emphasis: 'No sponsorship needed' },
    // Stated by the assistant when asked where I am from or about my status.
    canadianStatus: 'Permanent resident of Canada',

    headline: 'I ship systems, and I explain them.',
    avatar: 'images/portrait.jpg',
    // object-position for the hero crop; she stands right of centre in this frame.
    avatarPosition: '76% 42%',
  },

  /* ── Contact ───────────────────────────────────────────────────── */
  contact: {
    email: 'yiii9292@gmail.com',

    // No phone number here on purpose: this file is served publicly at
    // /data/profile-data.js, so anything in it is readable by anyone.
    // The phone number lives only in the private cv repo.

    linkedin: 'https://www.linkedin.com/in/mengyi-guo/',
    github: 'https://github.com/MengyiG',
    youtube: 'https://www.youtube.com/@Lea-pe7jy',

    // Web3Forms access key, set after signing up. The key is safe to expose publicly.
    formEndpoint: 'https://api.web3forms.com/submit',
    formAccessKey: '67b1ca47-e9d0-4792-96a3-b0beae4cfbfe',
    // Separate key used when the page is served from localhost.
    formAccessKeyLocal: '5e88b01e-5ace-4e4a-b1a8-2b609b4f620e',
  },

  /* ── Hero tags ─────────────────────────────────────────────────── */
  tags: [
    { label: 'Backend', primary: true },
    { label: 'DevOps & Cloud', primary: true },
    { label: 'Azure AKS' },
    { label: 'Terraform · Flux' },
    { label: 'EN · 中文' },
    { label: 'Toronto · Montréal' },
  ],

  /* ── Intro copy ────────────────────────────────────────────────── */
  intro: {
    short: 'Full-stack developer at SimWell. I build distributed backends on Java and Spring Boot, then run them on Azure Kubernetes with Terraform and Flux.',
    long: 'Full-stack developer at SimWell, where I am the primary engineer across the whole platform: backend services and the cloud infrastructure under them. I hold a master\'s in Second Language Education from McGill and worked as a certified English-Mandarin interpreter before a second master\'s in Information Technology at Virginia Tech.',
  },

  /* ── Path into tech ────────────────────────────────────────────── */
  /* In my own words. The assistant tells this story for "where are you from?"
     and "why tech?" questions; nothing here is shown on the page. */
  pathIntoTech: {
    beforeCanada: 'From 2011 to 2015, during my undergraduate studies in China, I worked many part-time English-Mandarin interpreting jobs, and earned the CATTI Level 3 interpreting certificate in 2014.',
    canada: 'Came to Canada in 2015 for a master\'s in Second Language Education at McGill. I am a permanent resident of Canada.',
    montreal: 'From 2017 to 2021 at Kells Academy in Montréal I handled accounts payable and receivable: sending payments to students around the world, reconciling their accounts, and explaining fees to students and parents from many countries. That work made my communication and people skills strong.',
    toronto: 'When I moved to Toronto in 2021 I did the same work at ILAC, from May to August 2021.',
    whyTech: 'I wanted something more challenging. I listen to podcasts every day and they drew me to the tech world, and I love learning new things and taking on challenges, so I switched to tech.',
    since: 'Master\'s in Information Technology at Virginia Tech, software engineering internships at Presagis (CAE) in Montréal and CIBC in Toronto, and now a full-stack developer at SimWell, based in Boston since August 2026.',
  },

  /* ── My philosophy ─────────────────────────────────────────────── */
  philosophy: {
    lead: 'Collaborate, share, and help solve problems.',
    points: [
      {
        title: 'Write it down',
        body: 'Years of interpreting taught me that a thing you cannot explain simply, you do not understand yet. I write the design doc before the code, and the runbook before the incident.',
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
      { group: 'Cloud · Azure', items: ['AKS', 'Key Vault', 'Blob Storage', 'Azure AD', 'ACR', 'PostgreSQL Flexible Server'] },
      { group: 'Infrastructure', items: ['Terraform', 'Flux v2', 'Kustomize', 'Helm', 'Docker', 'Gateway API'] },
      { group: 'Observability', items: ['OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana', 'Log Analytics'] },
    ],
    // What I am actively following right now. This is the part that should change often.
    trends: [
      { name: 'Agentic coding', note: 'Building with the Anthropic Java SDK at work; running Claude Code on my own projects daily.' },
      { name: 'Containerization', note: 'The same container from local development to Azure: built and run locally, pushed to ACR, deployed on AKS.' },
      { name: 'Platform engineering', note: 'GitOps all the way down. If it is not in the repo, it does not exist.' },
    ],
  },

  /* ── Projects ──────────────────────────────────────────────────── */
  projects: [
    {
      name: 'myRAGPlayground',
      repo: 'https://github.com/MengyiG/myRAGPlayground',
      year: 2026,
      stack: ['Python', 'RAG', 'Embeddings'],
      blurb: 'Retrieval experiments on my own documents: chunking strategies, embedding choices, and a harness for judging whether the answers actually improved.',
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
      webSummary: 'Primary engineer on the Compass platform, a multi-module Spring Boot microservice estate on Java 17, running on private Azure Kubernetes clusters that I provision with Terraform and deploy with Flux v2 GitOps. I own it end to end: backend, infrastructure, tests, operations, and the client conversations.',
      bullets: [
        'Served as the primary engineer across the full Compass platform lifecycle, owning backend development, cloud infrastructure, testing, operations, and direct client-facing technical communication end-to-end.',
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
      webSummary: 'Built eBanking payment features (Costco Business Card, Smart Planner) in an enterprise Spring Boot codebase, and worked production support, roughly three live issues a week, traced through Splunk and OpenShift.',
      bullets: [
        'Translated business requirements into technical specifications in Java; developed product features (Costco Business Card, Smart Planner) in an enterprise Spring Boot project, from requirement gathering to production support.',
        'Leveraged Splunk and Red Hat OpenShift to examine logs and performance data, debugging across thousands of transactions to investigate production issues.',
        'Analyzed HTTP request payloads, JSON and XML files to provide operational support, resolving approximately 3 production issues per week.',
      ],
    },
    {
      role: 'Software Engineer Intern',
      // Presagis is part of CAE; same internship, so recommendations may name either.
      company: 'Presagis (CAE)',
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
      // Two accounting roles in one entry: Kells Academy 2017 to 2021, ILAC May to Aug 2021.
      role: 'Accounts payable & receivable',
      company: 'Kells Academy · ILAC',
      period: '2017 – Aug 2021',
      start: '2017',
      end: '2021-08',
      location: 'Montreal, QC · Toronto, ON',
      current: false,
      priorCareer: true,
      stack: ['Accounts payable', 'Accounts receivable', 'Reconciliation', 'Client communication'],
      webSummary: 'Accounts payable and receivable at Kells Academy in Montreal from 2017 to 2021, then at ILAC in Toronto from May to August 2021: sending payments to students around the world, reconciling accounts, and explaining fees to students and parents from many countries. It is where my communication and people skills got strong.',
      bullets: [],
    },
    {
      role: 'English-Mandarin interpreter',
      company: 'Part-time and freelance',
      period: '2011 – 2015',
      start: '2011',
      end: '2015',
      location: 'China',
      current: false,
      priorCareer: true,
      stack: ['EN ⇄ 中文', 'Interpreting'],
      webSummary: 'Many part-time English-Mandarin interpreting jobs through my undergraduate years, and the CATTI Level 3 interpreting certificate in 2014.',
      bullets: [],
    },
  ],

  /* ── Education ─────────────────────────────────────────────────── */
  /* `mark` + `color` draw a typographic crest rather than the school's official
     logo, because university marks are trademarked and licensed. Swap in a real crest
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
    // CATTI: China Accreditation Test for Translators and Interpreters.
    { name: 'CATTI Level 3 Interpreter', issuer: 'English-Mandarin · China', date: '2014', mark: '文', color: '#4C6FF5' },
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
      emoji: '🐰',
      title: 'And a rabbit',
      body: 'Sharing the apartment with the dachshund. The side table, the book stack and anything left within reach are all considered theirs.',
      image: 'images/rabbit.jpg',
      imagePosition: 'center 45%',
    },
    {
      emoji: '🌳',
      title: 'Afternoons that go nowhere',
      body: 'A park, a bike and a few hours with nothing scheduled. Some of the best thinking happens away from a screen.',
      image: 'images/garden.jpg',
    },
    {
      emoji: '🔊',
      title: 'Three languages',
      body: 'English and Mandarin, certified to interpret between them live, plus beginner French from living in Montréal from 2015 to 2021. Je parle un peu français, et j\'apprends encore.',
      image: 'images/curious.jpg',
    },
    {
      emoji: '🏆',
      title: 'Always up for a contest',
      body: 'I have entered a lot of competitions over the years, public speaking among them. I have always liked a challenge.',
      image: 'images/public-speaking.jpg',
    },
    {
      emoji: '🪂',
      title: 'Jumped out of a plane',
      body: 'Went skydiving near Toronto in 2022. Same thing that pulled me into tech: I like a challenge.',
      image: 'images/skydiving.jpg',
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
      context: 'Same team for the past two years; attended the Confoo conference in Montreal together',
    },
    {
      quote: 'Her proactive nature truly stood out when she took the initiative to assist me in Dockerizing our application, showcasing not only her technical skills but also her willingness to collaborate and support her team.',
      author: 'Olivia Kim',
      title: 'Equity Derivatives IT · Google Cloud & AWS Certified Architect',
      relation: 'teammate',
      context: 'Women in Technology program team project',
    },
    {
      quote: 'Mengyi is one of the best teammates I had in Virginia Tech\'s MIT program. I noticed her eye for detail, team spirit, and objectivity in every assignment during the period I worked with her.',
      author: 'Sabrina Ahmed',
      title: 'Software Test Automation Engineer',
      relation: 'classmate',
      context: 'MIT degree program at Virginia Tech',
    },
    {
      quote: 'She always delivered exceptional quality, was extremely knowledgeable in the IT field, provided thorough research, and consistently delivered ahead of deadlines. An effective leader providing excellent collaboration.',
      author: 'Angela (Morris) Borden',
      title: 'Director, Multifamily Risk, Fannie Mae',
      relation: 'classmate',
      context: 'MIT degree program at Virginia Tech',
    },
    {
      quote: 'I was immediately impressed by her remarkable initiative to learn and grow professionally. Her dedication to continuous learning was not confined to our work hours.',
      author: 'Minfeng Xu',
      title: 'Application Developer, CIBC',
      relation: 'co-worker',
      context: 'CIBC, early 2023',
    },
    {
      quote: 'She is always keen to learn new technologies and can always complete tasks on time. I am impressed by her work ethic and communication skills.',
      author: 'Ran Shang',
      title: 'Online Programmer, Ubisoft',
      relation: 'co-worker',
      context: 'Presagis, three months',
    },
  ],

  /* ── AI assistant ──────────────────────────────────────────────── */
  /* The assistant is grounded in everything above. This block only holds
     what the data itself cannot express: tone, boundaries, and openers. */
  ai: {
    displayName: 'AI Mengyi',
    tagline: 'Ask me anything. I answer 24/7.',
    persona: 'Answer as Mengyi in the first person: direct, warm, specific. Prefer concrete detail over adjectives. It is fine to say you do not know.',
    boundaries: [
      'Never state a salary expectation or notice period. Say in the first person that you would rather discuss it directly, and point to the contact form.',
      'If asked about work authorization, visas or sponsorship, say plainly that you are authorized to work in the U.S. and need no sponsorship. You may also say you are a permanent resident of Canada. Do not discuss U.S. document types, expiry dates or any other immigration details.',
      'When asked where you are from, tell the story in `pathIntoTech`, in four or five sentences and in this order: from China, where you were a certified interpreter; came to Canada in 2015 for McGill, and always say you are a permanent resident of Canada; the payments and fees work at Kells Academy and ILAC, and the communication and people skills it built; wanting a bigger challenge, daily podcasts and a love of learning pulling you into tech; then Virginia Tech, the internships and SimWell in Boston. Let the curiosity and drive behind the switch come through.',
      'Never infer a city, campus, country or reason that is not written in this file. For example, do not say where Virginia Tech is, and give only the reasons for moving into tech that are written in `pathIntoTech`.',
      'Only use facts, stories and examples that appear in this file. Never invent anecdotes, conversations or situations, even as illustration. If the file has no example for a point, make the point without one.',
      'Answer in one paragraph of three or four sentences, or five for where you are from. Only go longer if the visitor asks for more detail.',
      'Always speak as Mengyi in the first person. Never refer to Mengyi as she or her, including when pointing someone to the contact form.',
      'Never use em dashes. Use commas, colons or separate sentences instead.',
      'When citing a recommendation, name only the company or program in its `context` field. Never place an anecdote at a different employer.',
    ],
    // Example questions under the ask box on the hero.
    // Visitors address the AI as "you"; the AI speaks as Mengyi in the first person.
    heroPrompts: [
      'What do you actually build?',
      'Do you need visa sponsorship?',
      'Are you a good teammate?',
      'Tell me a fun fact',
      'Where are you from?',
    ],
    suggestedQuestions: [
      'Do you need visa sponsorship?',
      'What do you actually build?',
      'Backend or DevOps?',
      'Are you a good teammate?',
      'How can I reach you?',
    ],
    handoff: 'When someone wants to reach me, point them to the contact form on this page rather than the email address.',
  },
};

/* Top-level `const` in a classic script is not a window property, so expose it. */
if (typeof window !== 'undefined') { window.PROFILE = PROFILE; }
if (typeof module !== 'undefined') { module.exports = PROFILE; }
