<div align="center">

# 🛡️ UptimeGuard

**Self-hosted uptime monitoring platform — your own UptimeRobot, zero subscriptions.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma)](https://prisma.io)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?logo=socket.io)](https://socket.io)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## Why UptimeGuard?

Most uptime monitoring services lock essential features behind paywalls. **UptimeGuard** gives you everything — unlimited monitors, real-time alerts, incident tracking, and beautiful dashboards — running entirely on **your own infrastructure**.

---

## ✨ Features

| Category | Details |
|---|---|
| **Monitoring** | HTTP/HTTPS checks, custom methods (GET/POST/PUT/DELETE), custom headers and body, keyword matching, configurable intervals (1–60 min), timeout control |
| **Real-time** | WebSocket-powered live status updates via Socket.io — no page refresh needed |
| **Alerts** | Telegram bot + Email (SMTP) notifications with per-monitor cooldown anti-spam |
| **Incidents** | Automatic incident journal — open/close with duration tracking |
| **Dashboard** | Uptime bars (24h), response-time line charts, 90-day history via Recharts |
| **Auth** | JWT access + refresh tokens, bcrypt password hashing, full user data isolation |
| **UI/UX** | Dark / Light theme (next-themes), Radix UI components, Framer Motion animations, fully responsive |
| **Infra** | Docker Compose one-command deploy, Prisma ORM, node-cron background checker with concurrency limit (p-limit) |

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Recharts, Framer Motion |
| **Backend** | Next.js API Routes, Socket.io, node-cron, p-limit, axios |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Auth** | JWT (access + refresh), bcryptjs, zod validation |
| **Alerts** | Nodemailer (SMTP), Telegram Bot API |
| **DevOps** | Docker, Docker Compose, ts-node custom server |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [Docker Desktop](https://docker.com/products/docker-desktop)
- npm / yarn / pnpm

### 1. Clone and Install

```
git clone https://github.com/thepradohigh/UptimeGuard.git
cd UptimeGuard
npm install
```
### 2. Start PostgreSQL
```
docker-compose up -d
```
### 3. Configure Environment
```
cp .env.example .env
```
### 4. Initialize Database
```
npx prisma generate
npx prisma db push
npx prisma db seed
```
5. Run
```
npm run dev
```

Open http://localhost:3000
Demo credentials: demo@uptimeguard.dev / demo123456

## ⚙️ Configuration
All settings live in .env:

Variable	Default	Description
DATABASE_URL	postgresql://...@localhost:5433/...	PostgreSQL connection string
JWT_SECRET	—	Required. Secret for access tokens
JWT_REFRESH_SECRET	—	Required. Secret for refresh tokens
SMTP_HOST	—	SMTP server for email alerts
SMTP_PORT	587	SMTP port
SMTP_USER	—	SMTP username
SMTP_PASS	—	SMTP password
SMTP_FROM	—	Sender email address
TELEGRAM_BOT_TOKEN	—	Telegram Bot API token
NOTIFY_COOLDOWN	5	Minutes between repeated alerts per monitor
MAX_MONITORS	50	Monitor limit per user
CHECKER_CONCURRENCY	10	Max parallel HTTP checks

## 📁 Project Structure
text

UptimeGuard/
├── prisma/
│   ├── schema.prisma          # Data models and enums
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login and Register pages
│   │   ├── (dashboard)/       # Protected layout and pages
│   │   │   ├── dashboard/     # Overview with charts
│   │   │   ├── monitors/      # List, Create, Detail, Edit
│   │   │   ├── incidents/     # Active and resolved incidents
│   │   │   └── settings/      # Profile and notification prefs
│   │   ├── api/
│   │   │   ├── auth/          # register / login / refresh
│   │   │   ├── monitors/      # CRUD / toggle / checks / stats
│   │   │   ├── incidents/     # Query active/resolved
│   │   │   └── user/          # Profile GET/PUT
│   │   └── layout.tsx         # Root layout + providers
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── monitors/          # Monitor cards, forms, charts
│   │   └── layout/            # Sidebar, Header, ThemeToggle
│   ├── lib/
│   │   ├── auth.ts            # JWT helpers
│   │   ├── checker.ts         # Background HTTP checker
│   │   ├── notifications.ts   # Telegram + Email dispatch
│   │   ├── prisma.ts          # Singleton Prisma client
│   │   └── socket.ts          # Socket.io client singleton
│   └── server.ts              # Custom server (Next + Socket.io)
├── docker-compose.yml         # PostgreSQL service
├── Dockerfile                 # Production build
├── tsconfig.server.json       # Server-side TS config
└── package.json


##🔌 API Reference
All routes are prefixed with /api. Auth routes are public; all others require Authorization: Bearer <token>.

Auth
Method	Endpoint	Description
POST	/api/auth/register	Create account
POST	/api/auth/login	Get access + refresh tokens
POST	/api/auth/refresh	Rotate tokens
Monitors
Method	Endpoint	Description
GET	/api/monitors	List user monitors
POST	/api/monitors	Create monitor
GET	/api/monitors/:id	Monitor details
PUT	/api/monitors/:id	Update monitor
DELETE	/api/monitors/:id	Delete monitor
PATCH	/api/monitors/:id/toggle	Pause / Resume
GET	/api/monitors/:id/checks	Check history
GET	/api/monitors/:id/stats	Uptime and response stats
GET	/api/monitors/:id/incidents	Monitor incidents
Incidents and User
Method	Endpoint	Description
GET	/api/incidents?status=active	All incidents
GET	/api/user/profile	Current user profile
PUT	/api/user/profile	Update profile and notification settings


## 🔔 Notifications
Telegram
Message @BotFather and run /newbot
Copy the bot token
Set TELEGRAM_BOT_TOKEN in .env
In Settings > Notifications, enter your Telegram Chat ID
Email
Configure SMTP variables in .env
In Settings > Notifications, enter your email and enable email alerts
Both channels respect the NOTIFY_COOLDOWN to prevent alert storms.

## 🐳 Docker (Production)
```
docker-compose --profile production up -d --build
```

### The included Dockerfile uses a multi-stage build:

deps — install dependencies
builder — prisma generate + next build
runner — minimal production image


### 🤝 Contributing
Contributions are welcome!

Fork the repo
Create a feature branch (git checkout -b feat/amazing-feature)
Commit your changes (git commit -m 'feat: add amazing feature')
Push to the branch (git push origin feat/amazing-feature)
Open a Pull Request


### 📄 License
MIT — free for personal and commercial use.
Built with love and too much coffee.

⭐ Star this repo if it helped you!

</div> ```
