# BuildPath — Business Setup Platform

An interactive platform that guides entrepreneurs step-by-step through business compliance, operations, and readiness with a gamified roadmap.

## Project Structure

```
├── api/          # Express.js backend API
├── frontend/     # Next.js 14 frontend
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend (API)

```bash
cd api
cp .env.example .env   # Configure your environment variables
npm install
npm run dev
```

The API runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
cp .env.example .env.local   # Configure your environment variables
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`

## Deployment on Render

### Frontend (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

### Backend (Web Service)

| Setting | Value |
|---------|-------|
| Root Directory | `api` |
| Build Command | `npm install` |
| Start Command | `npm start` |

## Environment Variables

See `.env.example` files in both `api/` and `frontend/` directories.

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS
- **Backend:** Express.js, Node.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** Auth0
- **Payments:** Stripe
