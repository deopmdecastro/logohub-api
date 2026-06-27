# 🚀 LogoHub API

**The World's Largest Visual Identity API** — access 50,000+ logos, icons, flags, sports emblems, crypto coins, and more.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Hono](https://img.shields.io/badge/framework-Hono-purple)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/db-PostgreSQL%2016-336791)](https://www.postgresql.org)

---

## 📦 Features

- 🔐 **Full auth system** — Register, login, JWT, password reset, profile management
- 👥 **Admin dashboard** — User CRUD, ban/block, reset passwords, role management
- 🎨 **Creator dashboard** — Upload content, track earnings, manage assets
- 🔑 **Consumer dashboard** — API key management, usage tracking
- 📊 **Analytics** — Real-time charts, request stats, latency tracking
- 🔔 **Notifications** — SSE real-time stream + REST API
- 📧 **Emails** — SMTP with welcome, reset, and notification templates
- 🎮 **Playground** — Online code editor (HTML/CSS/JS/TS)
- 📚 **Swagger UI** — Full OpenAPI 3.1 spec at `/api/docs`
- 🐘 **PostgreSQL** — Docker Compose setup with pgAdmin
- 🧬 **Prisma schema** — Type-safe ORM types

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Runtime        | [Hono](https://hono.dev) (SSR/API)  |
| Language       | TypeScript 5.3                      |
| Database       | PostgreSQL 16 (Docker)              |
| ORM            | Prisma (schema types)               |
| Auth           | JWT (jsonwebtoken) + bcryptjs       |
| Email          | SMTP / nodemailer-compatible        |
| Build          | Vite 6 (SSR bundle)                 |
| Deploy         | Cloudflare Workers + Docker         |
| Charts         | Chart.js                            |
| CSS            | Tailwind CSS (CDN)                  |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/deopmdecastro/logohub-api.git
cd logohub-api
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://logohub:logohub_dev_2026@localhost:5432/logohub
JWT_SECRET=change-this-in-production-2026
APP_URL=http://localhost:3000
NODE_ENV=development

# Optional — SMTP for emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@logohub.dev
```

### 3. Start Database (Docker)

```bash
docker-compose up -d
```

This launches:
- **PostgreSQL 16** on port `5432`
- **pgAdmin** on port `5050` (login: `admin@logohub.dev` / `admin_dev_2026`)
- Auto-runs `docker/init.sql` — creates all tables + 3 demo users

### 4. Run

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Demo Accounts

| Role     | Email                  | Password   | Dashboard              |
|----------|------------------------|------------|------------------------|
| Admin    | `admin@logohub.dev`    | `Demo@2026` | `/dashboard`          |
| Creator  | `creator@logohub.dev`  | `Demo@2026` | `/dashboard/creator`  |
| Consumer | `consumer@logohub.dev` | `Demo@2026` | `/dashboard/consumer` |

> Passwords are hashed with bcrypt. These credentials are seeded via `docker/init.sql`.

---

## 📁 Project Structure

```
logohub-api/
├── docker/                    # Docker setup
│   └── init.sql               # Full DB schema + demo data
├── prisma/
│   └── schema.prisma          # Prisma type definitions
├── src/
│   ├── index.tsx              # App entry — all routes
│   ├── swagger.ts             # OpenAPI 3.1 specification
│   ├── data/
│   │   ├── db.ts              # PostgreSQL client (HTTP proxy)
│   │   ├── store.ts           # Hybrid store (DB + in-memory fallback)
│   │   └── users.ts           # Legacy user store (re-export)
│   ├── routes/
│   │   ├── api.ts             # Public API (logos, search, categories)
│   │   ├── auth.ts            # Auth + admin routes
│   │   ├── admin.ts           # Admin dashboard endpoints
│   │   ├── keys.ts            # API key CRUD
│   │   ├── notifications.ts   # Notifications + SSE
│   │   └── playground.ts      # Code compiler
│   ├── pages/                 # SSR HTML pages (Hono JSX-style)
│   │   ├── public.ts          # Landing, explorer, docs
│   │   ├── auth_pages.ts      # Login, register
│   │   ├── profile_page.ts    # Profile management
│   │   ├── admin_users.ts     # Admin user management
│   │   ├── dashboard.ts       # Admin overview + keys
│   │   ├── other.ts           # Settings, team, billing, analytics, dashboards
│   │   ├── content.ts         # Content management
│   │   ├── notifications_page.ts  # Notifications inbox
│   │   ├── playground_page.ts # Playground UI
│   │   ├── layout.ts          # Sidebar, topbar, shell wrappers
│   │   ├── shared.ts          # HEAD, COMMON_JS
│   │   └── footer.ts          # Privacy, terms, about, etc.
│   └── services/
│       └── email.ts           # SMTP email service + templates
├── .env                       # Environment variables (git-ignored)
├── .env.example               # Environment template
├── docker-compose.yml         # PostgreSQL + pgAdmin
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 API Endpoints

Full interactive docs at **[/api/docs](http://localhost:3000/api/docs)**

### Auth
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/v1/auth/register`           | Create account           |
| POST   | `/api/v1/auth/login`              | Login → JWT              |
| GET    | `/api/v1/auth/me`                 | Get profile              |
| PATCH  | `/api/v1/auth/me`                 | Update profile           |
| POST   | `/api/v1/auth/logout`             | Invalidate session       |
| POST   | `/api/v1/auth/change-password`    | Change own password      |
| POST   | `/api/v1/auth/forgot-password`    | Request reset email      |
| POST   | `/api/v1/auth/reset-password`     | Reset with token         |

### Admin
| Method | Endpoint                              | Description          |
|--------|---------------------------------------|----------------------|
| GET    | `/api/v1/admin/users`                 | List all users       |
| PATCH  | `/api/v1/admin/users/:id`             | Update user          |
| DELETE | `/api/v1/admin/users/:id`             | Delete user          |
| POST   | `/api/v1/admin/users/:id/reset-password` | Reset user password |
| GET    | `/api/v1/admin/plans`                 | List plans           |
| PATCH  | `/api/v1/admin/plans/:id`             | Update plan          |
| GET    | `/api/v1/admin/stats`                 | Usage statistics     |
| GET    | `/api/v1/admin/settings`              | List settings        |
| PATCH  | `/api/v1/admin/settings/:key`         | Update setting       |
| GET    | `/api/v1/admin/activity`              | Activity log         |

### API Keys
| Method | Endpoint                      | Description       |
|--------|-------------------------------|-------------------|
| GET    | `/api/v1/keys`                | List your keys    |
| POST   | `/api/v1/keys`                | Create new key    |
| GET    | `/api/v1/keys/:id`            | Key details       |
| PATCH  | `/api/v1/keys/:id`            | Update key        |
| DELETE | `/api/v1/keys/:id`            | Delete key        |
| POST   | `/api/v1/keys/:id/revoke`     | Revoke key        |

### Notifications
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| GET    | `/api/v1/notifications`               | List notifications       |
| GET    | `/api/v1/notifications/stream`        | SSE stream               |
| GET    | `/api/v1/notifications/unread-count`  | Unread count             |
| PATCH  | `/api/v1/notifications/read-all`      | Mark all read            |
| PATCH  | `/api/v1/notifications/:id/read`      | Mark one read            |
| DELETE | `/api/v1/notifications/:id`           | Delete notification      |

### Assets (Public)
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/v1/logo/:slug`          | Get logo by slug         |
| GET    | `/api/v1/logos`               | List all logos           |
| GET    | `/api/v1/search?q=`           | Full-text search         |
| GET    | `/api/v1/categories`          | List categories          |
| GET    | `/api/v1/football`            | Football teams           |
| GET    | `/api/v1/basketball`          | Basketball teams         |
| GET    | `/api/v1/formula1`            | F1 teams                 |
| GET    | `/api/v1/flags`               | Country flags            |
| GET    | `/api/v1/crypto`              | Cryptocurrencies         |
| GET    | `/api/v1/frameworks`          | Frameworks               |
| GET    | `/api/v1/languages`           | Programming languages    |
| GET    | `/api/v1/cloud`               | Cloud providers          |
| GET    | `/api/v1/stats`               | API stats                |
| GET    | `/api/v1/health`              | Health check             |

### Pages (SSR)
| Route                         | Description              |
|-------------------------------|--------------------------|
| `/`                           | Landing page             |
| `/login`                      | Login page               |
| `/register`                   | Registration page        |
| `/playground`                 | Code editor              |
| `/dashboard`                  | Admin dashboard          |
| `/dashboard/admin/users`      | User management          |
| `/dashboard/creator`          | Creator dashboard        |
| `/dashboard/consumer`         | Consumer dashboard       |
| `/dashboard/analytics`        | Analytics + charts       |
| `/dashboard/profile`          | Profile management       |
| `/dashboard/notifications`    | Notifications inbox      |
| `/dashboard/keys`             | API keys page            |
| `/docs`                       | Documentation            |
| `/api/docs`                   | Swagger UI               |

---

## 🗄️ Database Setup (PostgreSQL)

### Option A: Docker (recommended)

```bash
docker-compose up -d
```

- Database auto-creates on first start
- `docker/init.sql` runs automatically — creates tables, indexes, default settings, and 3 demo users
- **pgAdmin** available at [http://localhost:5050](http://localhost:5050)

### Option B: Local PostgreSQL

1. Install PostgreSQL 16
2. Create database:
```bash
createdb logohub
```
3. Run init script:
```bash
psql -U postgres -d logohub -f docker/init.sql
```
4. Set `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/logohub
```

### Schema Overview

The database has 8 tables:

| Table              | Description                        |
|--------------------|------------------------------------|
| `users`            | User accounts (admin/creator/consumer) |
| `api_keys`         | API key management                 |
| `content`          | Logo/icon/asset records            |
| `notifications`    | In-app notification system         |
| `settings`         | Platform configuration (KV store)  |
| `team_members`     | Team management                    |
| `activity_log`     | Audit trail for admin actions      |
| `password_resets`  | Password reset tokens              |

Full schema at [`docker/init.sql`](docker/init.sql) — Prisma types at [`prisma/schema.prisma`](prisma/schema.prisma).

---

## 🔒 Authentication Flow

```
POST /api/v1/auth/register  →  User created + JWT returned
POST /api/v1/auth/login     →  User authenticated + JWT returned

All protected endpoints:
  Authorization: Bearer <jwt_token>

Admin-only endpoints also check:  user.role === 'admin'
```

- **JWT expiry**: 24 hours
- **Password hashing**: bcrypt (cost factor 10)
- **Session store**: In-memory (DB-proxy in production)

---

## 🏗️ Build & Deploy

### Development

```bash
npm run dev
# → http://localhost:3000 (SSR + API)
```

### Production Build

```bash
npm run build
# → dist/_worker.js (~440KB)
```

### Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

### Run with Node.js

```bash
npm run build
node dist/_worker.js
```

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@2026"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@logohub.dev","password":"Demo@2026"}'

# Get a logo
curl http://localhost:3000/api/v1/logo/google

# Search
curl "http://localhost:3000/api/v1/search?q=apple"
```

---

## 📧 Email Configuration

Set SMTP credentials in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@logohub.dev
```

In **development**, emails are logged to console instead of sent (no SMTP credentials needed).

### Email Templates

- **Welcome** — Sent on registration with dashboard link
- **Password Reset** — Sent on forgot-password with 1-hour token link
- **Notification** — Generic notification email

---

## 📄 License

MIT © [Deogracia De Castro](https://github.com/deopmdecastro) — LogoHub 2026
