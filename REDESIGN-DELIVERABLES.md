# 7Golden Website Redesign — Phase 8 Deliverables

**Branch:** `redesign/golden-orchard-editorial` — pushed to origin
**Remote:** https://github.com/nimarahimloo/7golden/tree/redesign/golden-orchard-editorial
**Art direction:** Golden Orchard Editorial
**Status:** Implementation complete; NOT merged to `main`, NOT deployed (per instruction)

---

## 1. Research Summary (16 candidates; 11 inspected in depth)

| # | Site | URL | Status | Decision |
|---|------|-----|--------|----------|
| 1 | Ferrero Hazelnut Company | https://www.ferrerohazelnutcompany.com/int/en/ | Loaded, analyzed | **Adapt** — warm cream base + gold accents, editorial serif |
| 2 | Wonderful Pistachios B2B | https://b2b.wonderfulpistachios.com/ | Loaded, analyzed | **Adapt** — pistachio green secondary accent |
| 3 | Nuts.com | https://www.nuts.com/ | Loaded, analyzed | **Adapt** — marquee motion for awards strip |
| 4 | Oatly | https://www.oatly.com/ | Loaded, analyzed | **Adapt** — editorial typography scale |
| 5 | La Colombe | https://www.lacolombe.com/ | Loaded, analyzed | **Adapt** — dark scrim over photo heroes |
| 6 | Tavazo | https://www.tavazo.com/ | Loaded, analyzed | **Adapt** — Persian RTL dry-fruit layout |
| 7 | Kourosh Foods | https://kouroshfoods.com/ | Loaded, analyzed | **Adapt** — Persian B2B enterprise tone |
| 8 | Zarinpal | https://www.zarinpal.com/ | Loaded, analyzed | **Adapt** — Persian light-theme readability |
| 9 | Alibaba.ir | https://alibaba.ir/ | Loaded, analyzed | **Adapt** — Persian UI density |
| 10 | Chobani | https://www.chobani.com/ | Loaded, analyzed | **Adapt** — warm photography-led storytelling |
| 11 | 7Golden production | http://46.34.163.95/ | Loaded (baseline) | **Baseline** — dark gold theme |
| 12 | Jacquemus | https://www.jacquemus.com/ | **Maintenance mode** (limited) | **Avoid** — unavailable during research |
| 13 | Cargill | https://www.cargill.com/ | **Access Denied** (bot wall) | Candidate only; not inspected |
| 14 | Barilla | https://www.barilla.com/en-en | **Cloudflare blocked** | Candidate only; not inspected |
| 15 | Active Theory | https://activetheory.net/ | **"Not Supported"** (geo-blocked) | Candidate only; not inspected |
| 16 | Lusion | https://lusion.co/ | Loaded; **canvas present, rendering not verified** | **Reference** — motion/WebGL precedent (dark scene) |

**Depth:** 11 references were loaded, screenshotted, and analyzed in depth (within the mission's 8–12 range). 4 more were candidates only (blocked by maintenance/bot walls/geo). 1 (Lusion) loaded but its WebGL rendering was not visually verified — noted honestly.

**Screenshots:** `/home/user/workspace/refs/*.jpeg`

---

## 2. Art Direction Rationale — Three Directions Compared

| Direction | Palette | Feel | Why not chosen |
|-----------|---------|------|----------------|
| **Refined Dark** | Near-black bg, gold accents | Luxury, cinematic | B2B food buyers need trust/transparency; dark can read as exclusive rather than credible for a pistachio/saffron exporter |
| **Industrial Light** | Cool white, steel gray | Corporate, efficient | Felt cold/sterile for a food brand; lacked warmth and editorial personality |
| **Golden Orchard Editorial** ✅ | Warm cream #FAF6EE, ink-brown #292114, pistachio green #3E6B35, brass gold #8A6A24; dark cinematic scrims over photography heroes | Warm, editorial, trustworthy, premium | — (chosen) |

**Three.js decision:** Removed the hero's 3D integration (HeroNutScene was no longer imported by HeroSlider; photography-led hero with warm vignette judged more premium/trustworthy for B2B food buyers). **Note:** the `three` dependency remains in `package.json` (now unreferenced by any live component — `HeroNutScene.jsx` and `GoldDustField.jsx` are orphaned files). Deliberate, documented — not fashionable WebGL. Lusion.co was the functioning WebGL reference candidate; photography was chosen instead for this brand.

---

## 3. Routes & Components

### Routes (App.jsx)

**Active routes:** `/`, `/shop`, `/product/:id`, `/about`, `/news`, `/news/:slug`, `/gallery` (redirects → `/about`), `/contact`, `/blog`, `/blog/:slug`, `/admin`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/oauth/consent`, 404 catch-all.

**Intentionally disabled:** `/checkout` and `/account` — commented out in App.jsx with the note "Retail routes disabled — 7Golden has no online checkout or customer account area." Visiting them renders the app's 404 catch-all (verified — this is intentional, not a regression).

### Components inspected/modified

HeroSlider, PageHero, BusinessCTA, AuthLayout, HomeClients, HomeAwardsSlider, HomeContactForm, HomeMagazine, ParallaxMedia, Shop, ProductDetail, Contact, NewsArticle, BlogPost, Admin, minimal-luxury.css, story.css, index.css, tailwind.config.js, home-media.js, seed.ts.

---

## 4. Improvements

- Full light-theme rewrite (`src/index.css`) — warm cream base, ink text, gold/pistachio accents
- Fixed pervasive muted-text contrast bug (duplicate dark `:root` in story.css)
- Removed the hero's 3D integration (photography-led hero, warm vignette)
- PageHero: dark scrim + cream text, height prop restored
- Shop: white labels over photos; ProductDetail: breadcrumbs + CTA
- Contact: white inputs, light theme
- Auth card: light theme
- Admin: `--accent`→`--accent-hsl` token collision fix (button backgrounds)
- Mobile: fixed bottom-tab clearance, hero height
- Missing video posters extracted via ffmpeg (`/video-posters/*.webp`)
- Missing seed image → committed banner fallback
- Empty magazine section hidden when no posts
- Gold CTA darkened to #8A6A24 with cream text (~4.9:1)
- RTL horizontal overflow clamp (768px fixed)
- Article hero titles (News + Blog): dark ink → cream on darkened photo heroes

---

## 5. Files Changed (24 files, 505+/325-)

```
REDESIGN-DELIVERABLES.md
backend/prisma/seed.ts
public/video-posters/facility-1.webp
public/video-posters/processing-1.webp
public/video-posters/showroom-1.webp
src/components/AuthLayout.jsx
src/components/BusinessCTA.jsx
src/components/HeroSlider.jsx
src/components/PageHero.jsx
src/components/home/HomeAwardsSlider.jsx
src/components/home/HomeClients.jsx
src/components/home/HomeContactForm.jsx
src/components/home/HomeMagazine.jsx
src/components/story/ParallaxMedia.jsx
src/index.css
src/lib/home-media.js
src/pages/BlogPost.jsx
src/pages/Contact.jsx
src/pages/NewsArticle.jsx
src/pages/ProductDetail.jsx
src/pages/Shop.jsx
src/styles/minimal-luxury.css
src/styles/story.css
tailwind.config.js
```

---

## 6. Dependencies

**No new dependencies added.** The `three` package remains in `package.json` but is now unreferenced (orphaned `HeroNutScene.jsx` / `GoldDustField.jsx`).

---

## 7. Lint / Test / Build Results

- **Lint:** `npx eslint src --quiet` → exit 0, zero errors (verified with `set -euo pipefail`) ✓
- **Build:** `npx vite build` → success (11.82s) ✓
- **Tests:** The repo has **no test script** — verified `package.json` scripts: `dev`, `build`, `lint`, `lint:fix`, `typecheck`, `preview`, `deploy`. No `*.test.*` files exist. Verification was manual via Playwright (see §8).

---

## 8. Pages & Viewports Actually Inspected

**Viewports:** 1440×900 (desktop), 768×1024 (tablet), 390×844 and 375×812 (mobile)

### Visually inspected (screenshots reviewed)
- 1440px: `/`, `/shop` (category section), `/contact` (cards + form), `/news/product-catalog-update` (headline fix verified), `/admin` (authed, real data), `/login`, `/register`, 404
- 375/390px: `/` (hero + mid-page + lower-page + true-bottom footer clearance), mobile menu cycle
- 768px: `/` (mid-page layout, no clipped text)

### Functionally exercised (Playwright)
- Contact form POST → verified in DB (contactMessage, marker `MARKER-QA-FINAL-8271`)
- Admin login (admin@7golden.co) → panel with real data (20 products, 7 news)
- Shop → category → product → inquiry click-through
- Hero slider button
- Reduced motion: marquee animation disabled (computed style verified)
- No `pageerror` events on any inspected route

### Not verified
- `/blog/:slug` (BlogPost) — **0 seeded blog posts**, so the detail page could not be visually verified with real data. The title-color fix was applied by code symmetry with NewsArticle (same pattern), which was verified.
- `/checkout`, `/account` — intentionally disabled (see §3); renders the 404 catch-all by design.
- Mid-scroll fixed-nav overlay on mobile is standard fixed-nav behavior (content scrolls under the translucent bar); the true-bottom clearance was verified — footer clears the bottom tab bar.

**Overflow:** No horizontal overflow at 375/390/768/1440px (scrollWidth ≤ clientWidth verified numerically at each width).

---

## 9. Unresolved Items

**Within the verified scope, no defects remain.** Known limitations:

- `three` dependency is now unused (orphaned components remain in the tree)
- `backend/package-lock.json` intentionally untracked (local SQLite setup; production uses PostgreSQL)
- `backend/.env` local-only with SQLite dev.db
- No automated test suite exists in the repo (manual Playwright QA only)

---

## 10. Branch / Commits / Preview

**Branch:** `redesign/golden-orchard-editorial` (pushed to origin)
**Remote:** https://github.com/nimarahimloo/7golden/tree/redesign/golden-orchard-editorial
**Commits (6):** 6d81a39, f39d943, 824ee20, 06eaf9a, c8df5c6, 42a343f
**Preview:** Local dev servers only (frontend :5173, backend :3001). Not deployed. **Do NOT merge or deploy without explicit authorization.**
