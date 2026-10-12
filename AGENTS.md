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
- Home product marquees (`ProductLineRow`) were blank for several seconds and the middle row often lagged: `ProductTile` hardcoded `loading="lazy"`, so the below-the-fold slider images only began downloading once scrolled into view (×4 duplicated copies made it worse). `ProductTile` now takes a `loading` prop (default `lazy`, plus `decoding="async"`) and `ProductLineRow` passes `loading="eager"` so all marquee images preload with the page. Keep lazy loading for the Shop grid / related products.
- `ProductLineRow` marquees ran **blank** after a few seconds in the RTL page: the row's track overflowed to the *left* while the JS transform moved it left too, so products slid off and the row emptied before the loop wrapped. Fixed by giving `.plr-viewport` `direction: ltr` (the same trick `.awards-marquee` and `.logo-marquee` already use) so the `translate3d(-offset)` loop math is unambiguous. Any new marquee MUST set `direction: ltr` on its track/viewport.
- The home product band is three separate self-moving rows, one per category (پسته / بادام / فندق), each a `ProductLineRow`. (A single navigable arrow/dot carousel was tried and removed — the user wants per-category auto-moving rows.)
- `backend/prisma/seed.ts` was out of sync with `schema.prisma` (referenced removed `_en` fields). Fixed to match the current schema (Persian-only fields).
- `backend/prisma/seed.ts` had a syntax error in the testimonial block (a `create({ data: {...} })` was incorrectly extended with extra object literals, causing `Expected identifier but found "{"`). Fixed by switching to `createMany({ data: [...] })` with a proper array.
- `backend/prisma/seed.ts` is now populated with the real 7golden catalog: 20 products (pistachio/almond/hazelnut), 3 categories, and 4 blog posts with Persian content migrated from the old WordPress site export. Real product images live in `public/product/*-7golden*.webp` where available; blog images live in `public/banner/`.
- Products that have no real WordPress image fall back to existing local `/product/*.webp` assets (e.g. `pistachio-slices.webp`, `brain-hazelnut.webp`).
- Added a dedicated **Gallery page** (`/gallery`, `src/pages/Gallery.jsx`) presenting the 10 facility/showroom/processing videos from `public/video/` and the 85 trade-show/factory photos in `public/gallery/` in a lightboxed mosaic. Data lives in `src/lib/gallery-content.js`. Route + Navbar/MobileMenu/Footer links wired.
- Studio food photography downloaded from the user into `public/banner/` (hero-nuts-bowl, banner-spoons-set, almond-milk, hazelnut-bowl, pistachio-dishes-teal, banner-four-bowls, hero-chopped-scoop, product-nuts-assortment) and placed across Home/Shop/About/Blog/ExportProcess pages as scene/hero/banner images. Note: the media upload served `4.jpeg`==`4-1.jpeg` and `8.jpeg`==`8-1.jpeg` as byte-identical files.

## Home Page Structure (current)
Current public home-page structure is defined in `src/pages/Home.jsx`. Product rows appear only when real API products exist; awards come from published CMS records and are omitted if none are available; the application section describes possible industry uses and must not be presented as a list of customers; both inquiry forms submit to the backend. Keep this note synchronized with the actual component tree.

New premium product photos placed in `public/banner/`: `hazelnut-spoon.jpg`, `pistachio-bowl-green.jpg`, `pistachio-kernels.jpg`, `tray-pistachio-almond.jpg`, `product-4-stack.jpg`, `hazelnut-chopped-dark.jpg`, `img-6052-split.jpg`.

## Testimonials and customer references

Do not create or ship sample customer quotations, customer names, customer logos, case studies, buyer ratings or endorsement-style wordmarks. A quote may be displayed only after its source and explicit permission to publish have been confirmed. Legacy unverified quotes are unpublished and are not a fallback source.

## Verifying
- `docker compose -f docker-compose.base44.yml ps` — all three services should be `healthy`
- `curl -s http://localhost:3000/api/health` — should return `{"ok":true,...}`
- `curl -s http://localhost:3000/` — should return HTML with Vite HMR script tags
- `curl -s http://localhost:3000/sitemap.xml` — should return XML (proxied to backend)

## SEO routes
- The sitemap is served by `backend/src/routes/sitemap.ts` at **both** `/api/sitemap.xml` and the canonical root `/sitemap.xml` (declared in `public/robots.txt`). `vite.config.js` proxies `/sitemap.xml` to the backend so it works in the dev/preview server too. If a reverse proxy is ever added in production, it must forward `/sitemap.xml` as well.
- Structured data is injected client-side by `src/components/Seo.jsx`: Organization + WebSite always, plus per-page JSON-LD and an auto-derived `BreadcrumbList` (`breadcrumbForPath` in `src/lib/seo.js`, static routes only).
- Palette is golden (`#D4AF37`) — the gold ramp lives in `src/index.css` (`--accent`, `--gold-1..4`, `--hairline*`, HSL `46 65% 52%`).

## Content integrity and public claims

Verified brand history for public copy:
- The family dry-goods wholesale business «خشکبار محمدی» has a history in Qazvin market dating to ۱۳۳۵.
- Dry-fruit processing began in a small Qazvin workshop in ۱۳۷۷.
- «شرکت خشکبار و بسته‌بندی هفت طلایی» was registered in ۱۳۹۶.
- The company's core product families are hazelnut, pistachio and almond products for use in food manufacturing.
- Office contact: قزوین، انتهای سعدی جنوبی، نرسیده به چهارراه بازار، پلاک ۲۱۰. Processing site: قزوین، شهرک صنعتی کاسپین ۲، نبش کوشش ۲.
- Contact numbers are ۰۲۸۳۳۲۳۴۰۰۴ and ۰۹۱۲۱۸۲۳۴۳۸; email is info@7golden.co.

Do not publish unverified claims about export markets, direct-from-grower sourcing, laboratory testing, traceability, certifications, production tonnage, guaranteed delivery, market leadership or customer results. Do not use customer logos, testimonials or event reports as placeholders. Claims about awards and certificates must correspond to real, reviewed documents.

## CMS and seed data safety

- Published CMS records are the public source of truth for products, categories, blog posts, gallery assets, awards and contact settings.
- Empty CMS/API results must produce a real empty state; API failure must produce a clear error or contact path, never a fabricated fallback catalogue.
- Seed data may initialize missing defaults. It must not delete CMS additions or overwrite later admin edits; use create-if-missing/upsert with an empty update object.
- The old bundled blog posts contain unverified event, customer, export and laboratory claims. Existing records are retained for editorial review but are unpublished. The public blog lists only approved CMS entries.
- Legacy /news URLs redirect to the blog index; do not restore hard-coded announcement content.
- Industry application examples describe possible use cases only; they are not customer references or endorsements.
- CMS hero titles, subtitles and images take precedence over safe factual fallback content.

## Scroll magic (light & smooth)
- `src/hooks/useScrollMagic.js` — a rAF-throttled, viewport-gated, transform-only parallax
  drift. Returns a ref to attach to a decorative/media wrapper. Disabled automatically for
  `prefers-reduced-motion`. Applied on the News page; reuse it anywhere a gentle drift is
  wanted instead of adding a heavy scroll library.

## Verifying
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/blog` → 200
- `curl -s http://localhost:3000/sitemap.xml | grep blog` → lists static public pages and published, non-legacy CMS posts; legacy `/news` paths are not indexed.
- `docker compose -f docker-compose.base44.yml exec -T frontend npx eslint src --quiet` → clean

## Performance & SEO (2026-10)
- **Image weight (site-wide)**: the source images were massively oversized — gallery photos were
  4–7.6 MB each and the home `MaskText` bands loaded a 6 MB image, product photos 200–570 kB.
  All of `public/gallery`, `public/banner`, `public/product`, `public/awards` and
  `public/certificates` were re-encoded with `sharp` (max width 1920 for gallery/banner, 1200 for
  product/awards, webp q80 / jpeg q82): **~470 MB → ~25 MB total**. Keep new uploads under a few
  hundred kB — run the same resize before committing new photos. `public/old` (35 MB) and
  `public/migrated` (12 MB) are unused leftovers, safe to delete.
- **Lazy/eager discipline**: hero images (`CinematicHero`, `PageHero`, article covers in
  `BlogPost`) stay eager and carry `fetchpriority="high"` + `decoding="async"`;
  everything below the fold (Blog/Contact closing bands, `HomeClients` pinned background, Shop
  line banner) is `loading="lazy" decoding="async"`. Note: React 18 needs the **lowercase**
  `fetchpriority` attribute (no camelCase alias before React 19) — the `react/no-unknown-property`
  rule is configured to ignore it.
- **Product marquee loading**: `ProductLineRow` now eager-loads only the **first** product copy; the
  duplicated copies (which are off-screen and only needed after a full loop) are `loading="lazy"`.
  This cut the home page's initial eager image count from ~80 to 20 and stops the duplicated
  marquee images from competing with the hero image for bandwidth. The first copy still covers
  the visible viewport on mobile and desktop, so the rows never render blank — keep it eager.
- **Production bundle**: `vite.config.js` splits `react`/`react-dom`/`react-router-dom` and
  `framer-motion` into cacheable vendor chunks (`manualChunks`), targets `es2020`, and drops
  `console`/`debugger` in production only (`esbuild.drop`). Entry chunk went 348 kB → 162 kB
  (gzip 112 kB → 51 kB). Dev behaviour is unchanged.
- **`index.html`**: preloads the two primary fonts (`PeydaWeb-Bold`, `YekanBakhFaNum-Regular`)
  used by the hero `<h1>` and body copy, adds `apple-touch-icon` + `sitemap` link, and carries a
  `<noscript>` block with the brand name, description, address, phone and email so crawlers and
  JS-disabled visitors still see real content. Keep the preloaded font list in sync with the
  font families actually used above the fold.

## Themed map band (Contact) & self-moving awards strip (Home)
- `src/pages/Contact.jsx` wraps the Google Maps embed in `.map-band` / `.map-frame` (CSS in
  `src/styles/story.css`). The iframe gets a warm gold/dark `filter`, a load-in fade driven by
  `data-loaded` (set from the iframe `onLoad`), and a `pointer-events: none` `.map-frame-veil`
  gradient that blends both edges into `--bg`. Keep the veil non-interactive.
- `src/components/home/HomeAwardsSlider.jsx` is now a caption-free, self-moving strip
  (`.awards-marquee`, pure CSS, seamless `-50%` loop, pause on hover, reduced-motion safe).
  The described awards grid stays on the About page (`AwardsSection`).
- Partner/customer logos: `HomeClients` reads `src/lib/clients.js`. Drop a real logo file into
  `public/clients/` and set `logo: '/clients/<file>'` on the entry — `ClientLogo` then renders
  the image instead of the generated lockup.
