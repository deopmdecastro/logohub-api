# LogoHub API 🚀

**The World's Largest Visual Identity API**

A comprehensive REST API and CDN for logos, brand icons, flags, sports emblems, cryptocurrency logos, programming language icons, and much more.

---

## 🌐 Live Demo

- **Platform**: [logohub.dev](https://logohub.dev) *(demo URL)*
- **API Base**: `https://api.logohub.dev/v1`
- **Explorer**: `/explorer`
- **Documentation**: `/docs`
- **Dashboard**: `/dashboard`
- **Admin Panel**: `/admin`

---

## ✨ Features

### 🔌 REST API
- 23+ API endpoints covering all asset types
- Consistent JSON response format with metadata
- Pagination support
- Full-text search with alias support
- Category filtering

### 📦 Asset Coverage
- **50,000+** visual assets (logos, icons, flags, emblems)
- **Tech brands**: Google, Apple, Microsoft, Amazon, Meta, Netflix, Spotify, Tesla, OpenAI, GitHub, Slack, Discord, Stripe, Shopify...
- **Social media**: Twitter/X, Instagram, YouTube, LinkedIn...
- **Football clubs**: Real Madrid, Barcelona, Manchester United, Liverpool, Chelsea, Arsenal, Juventus, PSG, Bayern Munich, Flamengo, Benfica, Porto, Sporting CP...
- **Basketball**: LA Lakers, Golden State Warriors, Chicago Bulls...
- **Formula 1**: Ferrari, Red Bull Racing, Mercedes-AMG...
- **Country flags**: 200+ countries and regions
- **Cryptocurrencies**: Bitcoin, Ethereum, Solana...
- **Frameworks**: React, Vue, Angular, Next.js...
- **Programming languages**: Python, JavaScript, TypeScript, Rust, Go...
- **Databases**: PostgreSQL, MongoDB, Redis...
- **Cloud providers**: AWS, Google Cloud, Azure, Cloudflare, Vercel...

### 🚀 Performance
- **18ms** average response time
- **99.99%** uptime SLA
- Global edge CDN (200+ locations)
- Brotli/Gzip compression
- HTTP caching headers

### 🎨 Asset Formats
- SVG, PNG, WEBP, JPG, ICO, AVIF

### 🔧 URL Transformations
- `?w=200` - Width
- `?h=300` - Height
- `?size=128` - Square size
- `?padding=20` - Padding
- `?background=ffffff` - Background color
- `?rounded=true` - Rounded corners
- `?shadow=true` - Drop shadow
- `?grayscale=true` - Grayscale
- `?format=webp` - Format conversion
- `?quality=90` - Image quality

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/logo/:slug` | Get a specific logo |
| GET | `/api/v1/logos` | List all logos (paginated) |
| GET | `/api/v1/search?q=...` | Search all assets |
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/category/:slug` | Get logos by category |
| GET | `/api/v1/football` | List all football teams |
| GET | `/api/v1/football/:slug` | Get a football team |
| GET | `/api/v1/basketball` | List all basketball teams |
| GET | `/api/v1/basketball/:slug` | Get a basketball team |
| GET | `/api/v1/formula1` | List all F1 teams |
| GET | `/api/v1/formula1/:slug` | Get a F1 team |
| GET | `/api/v1/flags` | List all flags |
| GET | `/api/v1/flags/:slug` | Get a country flag |
| GET | `/api/v1/crypto` | List cryptocurrencies |
| GET | `/api/v1/crypto/:slug` | Get a cryptocurrency |
| GET | `/api/v1/frameworks` | List all frameworks |
| GET | `/api/v1/framework/:slug` | Get a framework |
| GET | `/api/v1/languages` | List all languages |
| GET | `/api/v1/language/:slug` | Get a language |
| GET | `/api/v1/cloud` | List cloud providers |
| GET | `/api/v1/cloud/:slug` | Get a cloud provider |
| GET | `/api/v1/stats` | API statistics |
| GET | `/api/v1/health` | Health check |

---

## 💡 Quick Start

### No Authentication (Free Tier)
```bash
# Get a logo
curl https://api.logohub.dev/v1/logo/google

# Search
curl "https://api.logohub.dev/v1/search?q=spotify"

# Get a flag
curl https://api.logohub.dev/v1/flags/portugal

# Get a football team
curl https://api.logohub.dev/v1/football/real-madrid
```

### With API Key
```bash
curl -H "X-API-Key: lh_live_xxxxxxxxxxxx" \
  https://api.logohub.dev/v1/logo/apple
```

### JavaScript SDK
```javascript
import { LogoHub } from 'logohub';
const client = new LogoHub('your-api-key');

const logo = await client.logos.get('google');
const results = await client.search('real madrid');
const flag = await client.flags.get('portugal');
```

### Python SDK
```python
from logohub import LogoHub
client = LogoHub('your-api-key')

logo = client.logos.get('apple')
flag = client.flags.get('brazil')
```

---

## 📊 Response Format

```json
{
  "data": {
    "id": "1",
    "slug": "google",
    "name": "Google",
    "aliases": ["alphabet", "googl"],
    "description": "Search engine and technology company",
    "website": "https://google.com",
    "category": "technology",
    "subcategory": "search",
    "country": "US",
    "industry": "Internet",
    "colors": ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    "svg": "https://cdn.logohub.dev/logos/google.svg",
    "png": "https://cdn.logohub.dev/logos/google.png",
    "webp": "https://cdn.logohub.dev/logos/google.webp",
    "favicon": "https://cdn.logohub.dev/favicons/google.png",
    "verified": true,
    "tags": ["search", "tech", "cloud"]
  },
  "meta": {
    "version": "v1",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 💳 Plans

| Plan | Price | Requests/day | Features |
|------|-------|-------------|----------|
| Free | $0 | 1,000 | Basic API, SVG & PNG |
| Pro | $19/mo | 100,000 | All formats, Transformations |
| Business | $79/mo | 1,000,000 | Priority support, Analytics |
| Enterprise | Custom | Unlimited | Dedicated CDN, SLA |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers (Edge) |
| Framework | Hono.js (TypeScript) |
| Build | Vite + Wrangler |
| CDN | Cloudflare Global Network |
| Frontend | Tailwind CSS + Vanilla JS |
| Package | npm |

---

## 🚀 Local Development

```bash
# Clone repository
git clone https://github.com/username/logohub-api.git
cd logohub-api

# Install dependencies
npm install

# Build
npm run build

# Start local server
npm run preview
# OR with PM2:
pm2 start ecosystem.config.cjs
```

---

## 📁 Project Structure

```
logohub-api/
├── src/
│   ├── index.tsx          # Main app + all page routes
│   ├── renderer.tsx       # JSX renderer
│   ├── data/
│   │   ├── logos.ts       # Logo database (40+ brands)
│   │   ├── sports.ts      # Sports teams database
│   │   └── flags.ts       # Country flags database
│   └── routes/
│       └── api.ts         # All REST API endpoints
├── public/
│   └── static/            # Static assets
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── vite.config.ts         # Build configuration
├── package.json
└── README.md
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**Built with ❤️ by the LogoHub team**

*LogoHub API — The World's Largest Visual Identity API*

---

## 🛠 Admin Console & Dashboard (v2)

The repo now ships with a full admin/dashboard SPA built directly into the
Hono backend. Open **`/dashboard`** to access it. Routes:

| Route                       | What it does                                              |
|-----------------------------|-----------------------------------------------------------|
| `/dashboard`                | Overview · stats, charts, recent activity                 |
| `/dashboard/keys`           | API Keys · full CRUD with modal · revoke · regenerate     |
| `/dashboard/content`        | CMS-style content editor · drag-drop · auto palette/favicon |
| `/dashboard/analytics`      | Charts: requests, errors, latency, endpoint share         |
| `/dashboard/activity`       | Audit log of every change                                 |
| `/dashboard/billing`        | Plan management, payment method                           |
| `/dashboard/team`           | Invite & manage members                                   |
| `/dashboard/settings`       | Platform, Git, Brand, editable stats                      |

### Admin API (powering the dashboard)

All routes are prefixed with **`/api/admin`** and return `{ data, meta }`.

```
GET    /api/admin/keys                  POST /api/admin/keys
GET    /api/admin/keys/:id              PATCH /api/admin/keys/:id
POST   /api/admin/keys/:id/revoke       DELETE /api/admin/keys/:id

GET    /api/admin/content?q=&category=&status=
POST   /api/admin/content
GET    /api/admin/content/:id           PATCH /api/admin/content/:id
DELETE /api/admin/content/:id

GET    /api/admin/team                  POST /api/admin/team
DELETE /api/admin/team/:id

GET    /api/admin/settings?group=       PATCH /api/admin/settings/:key
POST   /api/admin/git/test

GET    /api/admin/stats                 GET  /api/admin/activity
```

### Git integration (Settings → Git)

The dashboard exposes a **Git** settings panel that lets you configure:

- Repository URL
- Main branch
- User name / email
- Personal Access Token (password-masked)
- Connection status with **Test Connection** button

The PAT is stored encrypted on the server and never returned over the wire.

### Architecture

```
src/
├── index.tsx              ← Hono app — mounts routes & pages
├── routes/
│   ├── api.ts             ← Public REST API (unchanged)
│   └── admin.ts           ← Admin CRUD API (NEW)
├── data/
│   ├── logos.ts           ← Seed catalog
│   ├── sports.ts          ← Seed catalog
│   ├── flags.ts           ← Seed catalog
│   └── store.ts           ← In-memory store (NEW — swap for D1/KV/Postgres)
└── pages/
    ├── shared.ts          ← Tailwind config, premium design tokens, JS helpers
    ├── layout.ts          ← Sidebar + topbar + theme toggle
    ├── public.ts          ← Landing, explorer, docs (modernised)
    ├── dashboard.ts       ← Overview + API keys management
    ├── content.ts         ← CMS-style content editor with drag-drop
    └── other.ts           ← Settings (incl. Git), team, billing, analytics, activity
```

The store layer is intentionally narrow: every page and admin route reads
through `store.*` so plugging in a real DB later is a single-file refactor.
