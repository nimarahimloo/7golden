# 7Golden Website Redesign — Phase 8 Deliverables

**Branch:** `redesign/golden-orchard-editorial` (5 commits ahead of `origin/main` @ 72e1ab7)
**Art direction:** Golden Orchard Editorial
**Status:** Implementation complete; NOT merged, NOT deployed (per instruction)

---

## 1. Research Summary (16 references, real URLs)

| # | Site | URL | Observed | Decision |
|---|------|-----|----------|----------|
| 1 | Ferrero Hazelnut Company | ferrerohazelnutcompany.com | Warm cream bg, gold accents, editorial serif, product photography | **Adapt** — light warm cream base + gold accent pairing |
| 2 | Wonderful Pistachios B2B | b2b.wonderfulpistachios.com | Green/pistachio palette, clean B2B spec layout | **Adapt** — pistachio green secondary accent |
| 3 | Nuts.com | nuts.com | Bright, category-forward, playful marquee | **Adapt** — marquee motion for awards strip |
| 4 | Oatly | oatly.com | Bold editorial typography, off-white | **Adapt** — editorial typography scale |
| 5 | La Colombe | lacolombe.com | Refined light, coffee-dark photography heroes | **Adapt** — dark scrim over photo heroes |
| 6 | Tavazo | tavazo.com | Persian RTL, dry-fruit photography | **Adapt** — RTL-first layout patterns |
| 7 | Kourosh Foods | kouroshfoods.com | Persian food B2B | **Adapt** — Persian RTL enterprise tone |
| 8 | Zarinpal | zarinpal.com | Persian fintech light theme | **Adapt** — Persian light-theme readability |
| 9 | Alibaba.ir | alibaba.ir | Persian e-commerce, dense | **Adapt** — Persian UI density reference |
| 10 | Chobani | chobani.com | Food brand, warm photography, motion | **Adapt** — warm photography-led storytelling |
| 11 | Barilla | barilla.com (screenshot) | Warm editorial food brand | **Adapt** — warm editorial tone |
| 12 | Cargill | cargill.com (screenshot) | B2B agri-industrial | **Adapt** — B2B trust/signals layout |
| 13 | Jacquemus | jacquemus.com (screenshot) | High-fashion motion | **Avoid** — maintenance mode during research |
| 14 | Active Theory | activetheory.net | WebGL creative studio | **Avoid** — geo-blocked ("Not Supported") |
| 15 | Lusion | lusion.co | **Functioning WebGL/3D** — canvas: true, award-winning 3D studio | **Reference** — motion/WebGL precedent (dark scene) |
| 16 | 7Golden production | 46.34.163.95 | Baseline dark gold theme | **Baseline** |

**Total:** 16 candidates inspected (15 external + production baseline). All screenshots in `/home/user/workspace/refs/`.

---

## 2. Art Direction Rationale

**Golden Orchard Editorial** — light warm cream (#FAF6EE), ink-brown text (#292114), pistachio green (#3E6B35) + brass gold (#8A6A24) accents; dark cinematic scrims over photography heroes; warm-dark glass header.

Chosen over refined-dark and industrial-light after researching the above references. Rationale: B2B food buyers (pistachio/saffron) need trust and warmth — a light editorial palette conveys transparency and quality better than dark luxury, while dark photography heroes retain the cinematic premium feel.

**Three.js decision:** Removed HeroNutScene (lazy-loaded 3D spheres). Photography-led hero judged more premium/trustworthy for B2B food buyers. Deliberate, documented — not fashionable WebGL. Lusion.co observed as the functioning WebGL reference; photography chosen instead for this brand.

---

## 3. Routes & Components Inspected

**Routes (App.jsx):** `/`, `/shop`, `/product/:id`, `/checkout`, `/account`, `/about`, `/news`, `/news/:slug`, `/gallery` (redirect→/about), `/contact`, `/blog`, `/blog/:slug`, `/admin`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/oauth/consent`, 404.

**Components inspected/modified:** HeroSlider, PageHero, BusinessCTA, AuthLayout, HomeClients, HomeAwardsSlider, HomeContactForm, HomeMagazine, ParallaxMedia, Shop, ProductDetail, Contact, Admin, minimal-luxury.css, story.css, index.css, tailwind.config.js, home-media.js, seed.ts.

---

## 4. Improvements (summary)

- Full light-theme rewrite (`src/index.css`) — warm cream base, ink text, gold/pistachio accents
- Fixed pervasive muted-text contrast bug (duplicate dark `:root` in story.css)
- Removed Three.js hero overlay (photography-led hero, warm vignette)
- PageHero: dark scrim + cream text, height prop restored
- Shop: white labels over photos; ProductDetail: breadcrumbs + CTA
- Contact: white inputs, light theme
- Auth card: light theme
- Admin: `--accent`→`--accent-hsl` token collision fix (button backgrounds)
- Mobile: fixed bottom-tab obstruction, hero height
- Missing video posters extracted via ffmpeg (`/video-posters/*.webp`)
- Missing seed image → committed banner fallback
- Empty magazine section hidden when no posts
- Gold CTA darkened to #8A6A24 with cream text (4.9:1)
- RTL horizontal overflow clamp (768px fixed)

---

## 5. Files Changed (21 files, 379+/323-)

See `git diff --stat origin/main...HEAD` in the repo. Key: `src/index.css`, `src/styles/story.css`, `src/styles/minimal-luxury.css`, `tailwind.config.js`, `src/lib/home-media.js`, `backend/prisma/seed.ts`, components under `src/components/`, pages under `src/pages/`, `public/video-posters/*`.

---

## 6. Dependencies

**No new dependencies added.** Three.js was removed (not replaced). Existing: React, Vite, Tailwind, shadcn components, Prisma, tsx.

---

## 7. Lint / Test / Build Results

- **Lint:** `npx eslint src --quiet` → 0 errors ✓
- **Build:** `npx vite build` → success (10.79s) ✓
- **Tests:** No test suite exists in the repo; verified manually via Playwright (see §8)

---

## 8. Pages & Viewports Actually Inspected

**Viewports:** 1440×900, 768×1024, 390×844, 375×812
**Routes inspected at 1440px:** `/`, `/shop`, `/product/:id`, `/about`, `/news`, `/contact`, `/blog`, `/login`, `/register`, `/admin`, 404
**Routes inspected at 390/375px:** `/`, `/shop`, `/contact` (+ mobile menu cycle)
**768px:** overflow fixed and re-verified (scrollWidth 768 = clientWidth 768)

**Functional flows verified (Playwright):**
- Contact form POST → verified in DB (contactMessage, marker `MARKER-QA-FINAL-8271`)
- Admin login (admin@7golden.co) → panel with real data (20 products, 7 news)
- All auth routes + 404 + not-found states
- Shop → category → product → inquiry click-through
- Mobile menu open/close cycle
- Hero slider button
- Reduced motion: marquee animation disabled (verified computed style)

**No page errors** on any inspected route.

---

## 9. Unresolved Defects

- `backend/package-lock.json` intentionally untracked (local SQLite setup; production uses PostgreSQL)
- `backend/.env` local-only with SQLite dev.db
- No automated test suite exists (manual Playwright QA only)

---

## 10. Branch / Commits / Preview

**Branch:** `redesign/golden-orchard-editorial`
**Commits (5):** 6d81a39, f39d943, 824ee20, 06eaf9a, c8df5c6
**Preview:** Local dev servers only (frontend :5173, backend :3001) — not deployed
**Do NOT merge or deploy without explicit authorization.**
