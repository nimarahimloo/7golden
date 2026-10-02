# 7Golden — Base44 Dev Environment

## Architecture
Fullstack app: Vite + React frontend (port 5173 → mapped to host 3000) + Express/Prisma backend (port 3001) + PostgreSQL 16.
All frontend API calls use relative `/api/*` and `/uploads/*` URLs, proxied to the backend through Vite's `server.proxy` config (single-origin approach). No direct browser-to-backend calls.

## Startup
```
docker compose -f docker-compose.base44.yml up -d
```
- **db**: postgres:16-alpine, healthcheck via pg_isready
- **backend**: node:22-alpine, bind-mounts `./backend`, installs deps + `apk add openssl` on startup, runs `prisma generate && prisma db push && seed`, then `tsx watch src/index.ts` (live reload)
- **frontend**: node:22-alpine, bind-mounts repo root, installs deps on startup, runs `vite --host 0.0.0.0 --port 5173` (live reload)

## Key Fixes Applied
1. **Seed/schema mismatch**: `backend/prisma/seed.ts` referenced `_en` fields (site_name_en, name_en, desc_en, etc.) that don't exist in `schema.prisma` (only `_fa` fields exist). Removed all `_en` fields from the seed.
2. **Dev-mode compose**: Created `docker-compose.base44.yml` with runtime base images + bind mounts + live reload (replacing the production-style `docker-compose.yml` that bakes source into images).
3. **Port mapping**: Frontend mapped to host port 3000 for the preview.

## Backend API
- Health: `GET /api/health`
- Content routes (public): `/api/products`, `/api/categories`, `/api/testimonials`, `/api/blog`, `/api/gallery`, `/api/awards`, `/api/settings`, `/api/contact`, `/api/orders`
- Entity routes (admin): `/api/entities/:EntityName` (PascalCase: Product, Category, BlogPost, etc.)
- Auth: `/api/auth/login`, `/api/auth/register`
- Admin login: `admin@7golden.co` / `admin123`

## Vite Host Config
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed bare to the frontend service env (platform-set). Vite 6.1+ appends it to `allowedHosts`.

## Notes
- `backend/schema.prisma` (root-level copy) is identical to `backend/prisma/schema.prisma`
- The repo's own `docker-compose.yml` uses production-style Dockerfiles (COPY source) — not suitable for dev edits
- `.bak` files exist throughout (seed.ts.bak, content.js.bak, etc.) — safe to ignore
