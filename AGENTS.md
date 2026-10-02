# 7Golden — Base44 Dev Environment

## Stack
- **Frontend:** React 18 + Vite 6 (port 5173 → host 3000), Tailwind, Radix UI
- **Backend:** Node.js + Express + Prisma + JWT (port 3001, internal only)
- **Database:** PostgreSQL 16

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Preview: http://localhost:3000
- API health: `curl http://localhost:3000/api/health` (proxied to backend:3001)

## Architecture
- Single-origin wiring: Vite dev server proxies `/api` and `/uploads` to the backend container. Only port 3000 is public.
- No external credentials needed — all infra is local (PostgreSQL, JWT secret in compose env).
- Admin login: `admin@7golden.co` / `admin123`

## Dev mode
- Frontend and backend use bind-mounted source with live-reload (Vite HMR, `tsx watch`).
- Backend startup: `npm install → prisma generate → prisma db push → seed → tsx watch`
- Frontend startup: `npm install → vite dev`
- `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` passed bare for Vite host allowlisting.

## Known fixes applied
- `backend/prisma/seed.ts` was out of sync with `schema.prisma` (referenced removed `_en` fields). Fixed to match the current schema (Persian-only fields).

## Verifying
- `docker compose -f docker-compose.base44.yml ps` — all three services should be `healthy`
- `curl -s http://localhost:3000/api/health` — should return `{"ok":true,...}`
- `curl -s http://localhost:3000/` — should return HTML with Vite HMR script tags
