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
- `backend/prisma/seed.ts` had a syntax error in the testimonial block (a `create({ data: {...} })` was incorrectly extended with extra object literals, causing `Expected identifier but found "{"`). Fixed by switching to `createMany({ data: [...] })` with a proper array.
- `backend/prisma/seed.ts` is now populated with the real 7golden catalog: 20 products (pistachio/almond/hazelnut), 3 categories, and 4 blog posts with Persian content migrated from the old WordPress site export. Real product images live in `public/product/*-7golden*.webp` where available; blog images live in `public/banner/`.
- Products that have no real WordPress image fall back to existing local `/product/*.webp` assets (e.g. `pistachio-slices.webp`, `brain-hazelnut.webp`).
- Added a dedicated **Gallery page** (`/gallery`, `src/pages/Gallery.jsx`) presenting the 10 facility/showroom/processing videos from `public/video/` and the 85 trade-show/factory photos in `public/gallery/` in a lightboxed mosaic. Data lives in `src/lib/gallery-content.js`. Route + Navbar/MobileMenu/Footer links wired.
- Studio food photography downloaded from the user into `public/banner/` (hero-nuts-bowl, banner-spoons-set, almond-milk, hazelnut-bowl, pistachio-dishes-teal, banner-four-bowls, hero-chopped-scoop, product-nuts-assortment) and placed across Home/Shop/About/Blog/ExportProcess pages as scene/hero/banner images. Note: the media upload served `4.jpeg`==`4-1.jpeg` and `8.jpeg`==`8-1.jpeg` as byte-identical files.

## Home Page Structure (current)
The home page now reads top→bottom as:
1. `CinematicHero` (hero-nuts-bowl)
2. Chapter 01 — `StickyScene` 3 pillars (pistachio-kernels, tray-pistachio-almond, hazelnut-spoon — new premium product photos)
3. Chapter 02 — Capacity stats (`img-6052.jpg` parallax)
4. Chapter 03 — Origin story (`banner-spoons-set` depth parallax)
5. `MaskText` 7GOLDEN band (`banner-four-bowls`)
6. Chapter 04/Showcase — `PRODUCT_STRIP` 4-card premium product-photo grid (hazelnut-spoon, pistachio-bowl-green, pistachio-kernels, product-4-stack) with `SCENE_IMAGE` scenes
7. `StickyScene`-driven product grid (from API products)
8. Chapter 06 — `ExportProcess` (export journey)
9. **Chapter 07 — `HomeAwardsSlider`** (`src/components/home/HomeAwardsSlider.jsx`) — awards shown as a full-view slider (image large & centered, prev/next, dots, auto-advance 6s), reads `/api/awards`, fallback curated list. Matches 7golden.co push to show awards full & clear on home.
10. **Chapter 08 — `HomeClients`** (`src/components/home/HomeClients.jsx`) — featured-buyers/testimonials band reading `/api/testimonials`, fallback `FALLBACK_CLIENTS`. Shows quote + stars + buyer name/role.

New premium product photos placed in `public/banner/`: `hazelnut-spoon.jpg`, `pistachio-bowl-green.jpg`, `pistachio-kernels.jpg`, `tray-pistachio-almond.jpg`, `product-4-stack.jpg`, `hazelnut-chopped-dark.jpg`, `img-6052-split.jpg`.

## Testimonials seed
`backend/prisma/seed.ts` testimonial block now **syncs** (create-if-missing + delete placeholders + re-sequence sort_order) instead of only seeding when count===0 — so the DB always converges to the curated 5 buyer testimonials (بستنی گلستان, قنادی برتر, شکلاتسازی آریا, هلدینگ خواروبار پارس, گروه صنایع غذایی سرو). After editing. restart backend to re-run seed: `docker compose restart backend`.

## Verifying
- `docker compose -f docker-compose.base44.yml ps` — all three services should be `healthy`
- `curl -s http://localhost:3000/api/health` — should return `{"ok":true,...}`
- `curl -s http://localhost:3000/` — should return HTML with Vite HMR script tags
- `curl -s http://localhost:3000/sitemap.xml` — should return XML (proxied to backend)

## SEO routes
- The sitemap is served by `backend/src/routes/sitemap.ts` at **both** `/api/sitemap.xml` and the canonical root `/sitemap.xml` (declared in `public/robots.txt`). `vite.config.js` proxies `/sitemap.xml` to the backend so it works in the dev/preview server too. If a reverse proxy is ever added in production, it must forward `/sitemap.xml` as well.
- Structured data is injected client-side by `src/components/Seo.jsx`: Organization + WebSite always, plus per-page JSON-LD and an auto-derived `BreadcrumbList` (`breadcrumbForPath` in `src/lib/seo.js`, static routes only).
- Palette is golden (`#D4AF37`) — the gold ramp lives in `src/index.css` (`--accent`, `--gold-1..4`, `--hairline*`, HSL `46 65% 52%`).

## Real brand content (source of truth)
All marketing copy is grounded in the brand's own public sources (7golden.co and
its foodkeys producer profile). Verified facts used across the site:
- Work began ۱۳۷۷ in a small Qazvin workshop; the company **شرکت خشکبار و بسته‌بندی هفت طلایی** was registered in ۱۳۹۶.
- Raw material is bought straight from growers via the family بنکداری (خشکبار محمدی, 100+ years) — no middleman.
- Pistachio from Buin-Zahra (Qazvin) and Kerman; hazelnut from Oshnavieh, Alamut (Qazvin) and northern Ashkvarat.
- Exports: UAE, Qatar, Oman, Iraq, Afghanistan (Europe via traders).
- Office: قزوین، سعدی جنوبی، نرسیده به بازار، پلاک ۲۱۰ (کدپستی ۳۴۱۹۶۱۷۹۴۸). Factory: بلوار ابوترابی، نرسیده به سه راه شهر صنعتی.
- Phone ۰۲۸۳۳۲۳۴۰۰۴ / ۰۹۱۲۱۸۲۳۴۳۸, email info@7golden.co.
Central copy lives in `src/lib/corporate-content.js` (products, capacity figures,
certificates, export markets), `src/lib/clients.js` (buyer sectors) and
`src/lib/i18n.js` (trust points, contact). Do **not** reintroduce invented
numbers (ISO 22000/HACCP claims, fabricated tonnage) — keep it to the facts above.
The buyer wall in `src/lib/clients.js` lists real **industry sectors**, not brand
names; drop real customer logos into `public/clients/` and set `logo:` per entry.

The editable `SiteSettings` row (phone, mobile, addresses, hours — shown in the
admin panel) is seeded with the same real values as `corporate-content.js` /
`i18n.js`; keep them in sync when the seed runs. All image references in `src/`
and `backend/` resolve to files under `public/` (verified with a broken-ref
scan). Legacy unused components (`BusinessCTA`, `OriginStory`, `TrustBadges`,
`ProvenanceSection`, `MainProducts`, `ExportMarkets`, `SpecialtyShowcase`,
`ProductAbout`, `ProductTabs`, `PromoBanner`) are no longer imported anywhere —
left in place but safe to delete.

## Removed
- The standalone **Awards page** (`/awards`, `src/pages/Awards.jsx`) was deleted, along with its route and all nav links. Awards/certificates still appear on the home page (`HomeAwardsSlider`) and About (`AwardsSection`); the awards API/data is untouched.
