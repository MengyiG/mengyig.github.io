# mengyig.github.io

Personal site for Mengyi Guo. Static HTML, CSS and vanilla JS, with no build
step and no framework. GitHub Pages serves `main` directly.

## One data file

Everything on the page is rendered from [`data/profile-data.js`](data/profile-data.js).
Nothing is hardcoded in the markup. Edit that file, push, and the site updates.

The AI assistant reads the same file (the Worker fetches it live), so a fact
corrected there is corrected everywhere at once.

```
data/profile-data.js   ← edit this
  ├── index.html + assets/js/render.js   → the page
  └── worker/index.js                    → what the AI assistant knows
```

## Layout

| Path | What it is |
|---|---|
| `index.html` | Structure and mount points only |
| `data/profile-data.js` | All content, the single source of truth |
| `assets/js/render.js` | Renders every section from the data file |
| `assets/js/chat.js` | The AI chat panel |
| `assets/css/main.css` | Styles |
| `images/` | Photos |
| `worker/` | Cloudflare Worker that talks to the Claude API |

## Local preview

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321.

## Setup still to do

### 1. Contact form

Sign up at [web3forms.com](https://web3forms.com) (free), then put the access key
in `data/profile-data.js` under `contact.formAccessKey`. The key is meant to be
public, since it only lets a form post to your own inbox.

Until it is set, the form tells visitors to email instead.

### 2. AI assistant

The API key lives in a Cloudflare Worker so the browser never sees it.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # paste the key at the prompt
npx wrangler deploy
```

Deploy prints a URL like `https://ai-mengyi.<subdomain>.workers.dev`. Put it in
`assets/js/chat.js` as `CONFIG.ENDPOINT`, then push.

Until it is set, the chat panel opens and says it is not connected yet rather
than pretending to answer.

**Cost.** The Worker uses `claude-haiku-4-5`, about half a cent per exchange. The profile data is cached between
requests, so a typical exchange is a fraction of a cent. But an open chat box on
a public page can be abused. The Worker caps message length, history length and
requests per IP per minute; for real protection add a Cloudflare Rate Limiting
rule on the Worker route, and set a spend limit in the Anthropic Console.

For better answers at a higher price, change `MODEL` in `worker/index.js` to
`claude-sonnet-5` or `claude-opus-5` and redeploy.

## Where the old site went

The previous version of this site is archived, with its full history, at
[MengyiG/mengyig-website-archive](https://github.com/MengyiG/mengyig-website-archive).
