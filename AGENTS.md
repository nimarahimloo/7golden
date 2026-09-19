# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.base44.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.

## Project Conventions

- **Fonts are local, never CDN.** All `@font-face` rules live at the top of `src/index.css` and point at flat `.woff2` files in `public/fonts/` (e.g. `/fonts/PeydaWeb-Regular.woff2`). Families: `Peyda` (headings), `Kalameh` (subheadings), `YekanBakh` (body). Source font archives live in `public/fonts/Peyda/` and `public/fonts/Kalameh/`; YekanBakh was fetched once from the former jsDelivr CDN and is now committed flat. Do not reintroduce external font/CDN links.
- **Dark mode is the only theme.** The root `<html>` always carries `class="dark"`; the palette lives on `:root` in `src/index.css` (no separate light block, no `.dark` overrides). `AppContext` has no `theme`/`toggleTheme`. Do not add theme switching back.
- **Dark & gold is the only palette, on every page.** The whole public site (home, shop, product, about, contact) reads one set of tokens on `:root` in `src/index.css`: near-black `--bg`/`--bg-secondary`, gold `--accent`, plus the section aliases `--ink` (headings), `--brass`, `--hairline`, `--soft-shadow` and the `.eyebrow` (small Latin label) / `.hairline` (thin rule) utilities. There is no scoped light theme any more — the old `.home-light` block was deleted, so never reintroduce a page-scoped palette; change the tokens on `:root` instead.
- **The home page talks with images, not text.** Its sections (HeroSlider, MainProducts, OriginStory) are image-led bands whose captions stop at a small Latin eyebrow label plus the product/section name; the descriptive paragraphs live on the inner pages, and the copy itself still lives in `src/lib/corporate-content.js`. Keep long copy off the home page.
- **`GoldenEssence` is the home page's ambient 3D backdrop, not a section.** It portals a fixed, pointer-transparent Three.js layer onto `<body>` at `z-index: 0` behind the content, so home sections must stay transparent or translucent (`rgba(6,4,2,0.5)`-ish) or they hide it. `Home.jsx` mounts it, and only there — mounting it in `App.jsx` would run WebGL on every page. It falls back to a static gold wash under `prefers-reduced-motion`.
- `ProductCardRound` is the home page's circular image tile; `ProductCard` stays the taller tile for the shop and product pages.
- **The scroll-story layer lives in `src/styles/story.css`** (imported from `main.jsx` after `index.css`) plus `src/components/story/`. It carries the shared narrative language: the `.display-*` type scale, `.gold-text`, the `.reveal*` entrance system, `.chapter` / `.chapter-shell` bands, `.panel` surfaces, `.gold-frame`, `.media-frame`, `.scene-*` (sticky scene), `.marquee`, `.btn-gold` / `.btn-ghost` / `.link-gold` and the `.nav-link` underline. Put new narrative sections in that layer rather than growing `index.css`.
- `StickyScene` (`src/components/story/StickyScene.jsx`) is the scroll-story mechanic: a track of `items.length * 100svh` holding one sticky full-height viewport whose picture and copy step through the items. It renders a static stacked fallback under `prefers-reduced-motion` — keep that fallback working, it is what keeps the content reachable without animation.
- `CinematicHero` opens the home page; `PageHero` opens every inner page (same props as before: `image`, `title`, `subtitle`, `badge`). `ScrollProgress` is mounted once in `App.jsx`.
- The gold palette ramp (`--gold-1` … `--gold-4`), `--hairline-strong`, `--panel` and `--panel-strong` are declared on `:root` in `src/index.css` alongside the original tokens. Change colours there, never in a page.
- `CountUp` accepts the Persian-formatted figures from `corporate-content.js` (e.g. `'۳٬۵۰۰'`, `'۱۵+'`) and re-renders them in Persian digits, counting up once in view.
- **Corporate / B2B positioning (not a shop).** 7Golden is presented as a trading & export company for pistachio, almond and hazelnut. Retail storefront logic is deliberately commented out, not deleted, so it is obvious what was switched off: `AppContext` pins `isStoreMode = false` (the `site_mode` lookup is commented), `App.jsx` no longer mounts `CartDrawer` and the `/checkout` + `/account` routes are commented, and the cart/price UI in `ProductCard`, `ProductDetail`, `Navbar`, `MobileMenu`, `BottomTabBar`, `Home` and `Shop` is wrapped in JSX comments. Do not re-enable any of it unless the client asks for a shop again.
- Business copy, capacity figures, export markets and certificates live in one editable place: `src/lib/corporate-content.js` (`MAIN_PRODUCTS`, `EXPORT_MARKETS`, `CERTIFICATES`, `CAPACITY_STATS`). The home page, products page and about page all read from it.
- The three flagship sections link to the first real product of each category (pistachio / almond / hazelnut) via `MAIN_PRODUCTS[].category`, because category slugs are not product slugs — `/product/pistachio` would 404.
- `docker-compose.base44.yml` runs the Vite dev server from the mounted source on host port 3000. The `@base44/vite-plugin` sets up an `/api` dev proxy whose target is `VITE_BASE44_APP_BASE_URL`. The platform's managed value for that variable points at a local Base44 backend (`http://localhost:4400`) which is never started in this sandbox, so the compose file pins it to `https://base44.app` — without that, `src/lib/AuthContext.jsx`'s relative `/api/apps/public/...` app-state check fails with `ECONNREFUSED 127.0.0.1:4400`. Do not remove that override.


