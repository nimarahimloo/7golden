# 7Golden Hero Slider — Read-only Project Audit

- Project root: `/home/nima/Documents/GitHub/7Golden`
- Source changes made: **No**
- Database or `.env` accessed: **No**
- Source/config files found by extension: **254**
- Text files scanned: **254**
- Skipped/unreadable files (includes secret/lock exclusions): **529**
- Likely relevant paths: **31**
- Files with keyword matches: **127**

> This is a static inventory. It identifies places to inspect; it does not certify that the slider is implemented or working.

## Likely relevant paths

- `apply_7golden_news_api_home_mosaic.py` (108179 bytes)
- `apply_7golden_news_api_home_mosaic_fixed.py` (109059 bytes)
- `apply_7golden_news_api_home_mosaic_fixed2.py` (110441 bytes)
- `audit_7golden_hero_slider.py` (14340 bytes)
- `backend/prisma/schema.prisma` (5102 bytes) — likely_backend
- `backend/prisma/seed.ts` (38304 bytes) — likely_backend, likely_migration_or_seed
- `backend/seed-catalog.mjs` (5059 bytes) — likely_backend, likely_migration_or_seed
- `backend/src/lib/prisma.ts` (294 bytes) — likely_backend
- `backend/src/routes/auth.ts` (3093 bytes) — likely_backend
- `backend/src/routes/content.ts` (10852 bytes) — likely_backend
- `backend/src/routes/entities.ts` (8876 bytes) — likely_backend
- `backend/src/routes/sitemap.ts` (2920 bytes) — likely_backend
- `backend/src/routes/upload.ts` (2458 bytes) — likely_backend
- `fix_7golden_admin_blog_upload.py` (20185 bytes) — likely_admin
- `src/api/base44Client.js` (4407 bytes) — likely_frontend, likely_backend
- `src/api/content.js` (4932 bytes) — likely_backend
- `src/components/CinematicHero.jsx` (6080 bytes) — likely_frontend
- `src/components/DynamicHeroSlider.jsx` (3788 bytes) — likely_frontend
- `src/components/HeroSlider.jsx` (11298 bytes) — likely_frontend
- `src/components/PageHero.jsx` (2095 bytes) — likely_frontend
- `src/components/ProtectedRoute.jsx` (1069 bytes) — likely_frontend
- `src/components/admin/AdminErrorBoundary.jsx` (1056 bytes) — likely_frontend, likely_admin
- `src/components/admin/EntityCrud.jsx` (20511 bytes) — likely_frontend, likely_admin
- `src/components/admin/RichTextEditor.jsx` (756 bytes) — likely_frontend, likely_admin
- `src/components/admin/SiteModeToggle.jsx` (2840 bytes) — likely_frontend, likely_admin
- `src/components/home/HomeAwardsSlider.jsx` (3065 bytes) — likely_frontend
- `src/components/ui/carousel.jsx` (4821 bytes) — likely_frontend
- `src/components/ui/slider.jsx` (914 bytes) — likely_frontend
- `src/lib/api/content.js` (8408 bytes) — likely_backend
- `src/lib/usePageHero.js` (1126 bytes)
- `src/pages/Admin.jsx` (27517 bytes) — likely_frontend, likely_admin

## Highest-signal files

- `audit_7golden_hero_slider.py` — score 23; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend, test_and_ci
- `apply_7golden_news_api_home_mosaic.py` — score 19; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend, test_and_ci
- `apply_7golden_news_api_home_mosaic_fixed.py` — score 19; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend, test_and_ci
- `apply_7golden_news_api_home_mosaic_fixed2.py` — score 19; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend, test_and_ci
- `AGENTS.md` — score 18; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend
- `apply_7golden_luxury_visual_refinement.py` — score 18; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders, slide_content_and_frontend
- `backend/prisma/seed.ts` — score 18; categories: admin_and_content_management, database_and_models, migrations_and_seeders, slide_content_and_frontend
- `src/components/HeroSlider.jsx` — score 15; categories: api_and_routes, database_and_models, slide_content_and_frontend
- `src/components/ui/carousel.jsx` — score 15; categories: api_and_routes, database_and_models, slide_content_and_frontend
- `src/pages/News.jsx` — score 14; categories: admin_and_content_management, api_and_routes, migrations_and_seeders, slide_content_and_frontend
- `src/styles/story.css` — score 14; categories: admin_and_content_management, api_and_routes, database_and_models, slide_content_and_frontend
- `apply_7golden_pagination_sidebar_fix.py` — score 13; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders
- `backend/README.md` — score 13; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders
- `docker-compose.base44.yml` — score 13; categories: admin_and_content_management, api_and_routes, database_and_models, migrations_and_seeders
- `fix_7golden_admin_blog_upload.py` — score 12; categories: admin_and_content_management, api_and_routes, database_and_models, test_and_ci
- `backend/Dockerfile` — score 11; categories: admin_and_content_management, database_and_models, migrations_and_seeders
- `backend/package.json` — score 11; categories: admin_and_content_management, database_and_models, migrations_and_seeders
- `backend/src/routes/content.ts` — score 11; categories: admin_and_content_management, api_and_routes, database_and_models
- `backend/src/routes/entities.ts` — score 11; categories: admin_and_content_management, api_and_routes, database_and_models
- `package.json` — score 11; categories: api_and_routes, database_and_models, slide_content_and_frontend
- `src/components/CinematicHero.jsx` — score 11; categories: api_and_routes, slide_content_and_frontend
- `src/components/DynamicHeroSlider.jsx` — score 11; categories: api_and_routes, slide_content_and_frontend
- `src/components/admin/EntityCrud.jsx` — score 11; categories: admin_and_content_management, api_and_routes, database_and_models
- `src/pages/Admin.jsx` — score 11; categories: admin_and_content_management, api_and_routes, migrations_and_seeders
- `src/pages/Shop.jsx` — score 11; categories: api_and_routes, migrations_and_seeders, slide_content_and_frontend
- `fix_7golden_rich_content_home_media.py` — score 10; categories: admin_and_content_management, api_and_routes, migrations_and_seeders, test_and_ci
- `src/pages/Blog.jsx` — score 10; categories: admin_and_content_management, api_and_routes, slide_content_and_frontend
- `src/pages/Home.jsx` — score 10; categories: admin_and_content_management, api_and_routes, slide_content_and_frontend
- `README.md` — score 9; categories: admin_and_content_management, api_and_routes, database_and_models
- `apply_7golden_news_blog_followup.py` — score 9; categories: admin_and_content_management, api_and_routes, migrations_and_seeders
- `backend/HOW_TO_RUN.md` — score 9; categories: admin_and_content_management, api_and_routes, database_and_models
- `backend/src/lib/serialize.ts` — score 9; categories: admin_and_content_management, api_and_routes, database_and_models
- `base44Client.js` — score 9; categories: admin_and_content_management, api_and_routes, database_and_models
- `src/components/MainProducts.jsx` — score 9; categories: admin_and_content_management, api_and_routes, database_and_models
- `backend/src/routes/auth.ts` — score 8; categories: api_and_routes, database_and_models
- `backend/src/routes/sitemap.ts` — score 8; categories: api_and_routes, database_and_models
- `backend/src/routes/upload.ts` — score 8; categories: admin_and_content_management, api_and_routes, test_and_ci
- `index.html` — score 8; categories: admin_and_content_management, slide_content_and_frontend
- `src/components/ui/slider.jsx` — score 8; categories: database_and_models
- `src/lib/editorial-blog-content.js` — score 8; categories: admin_and_content_management, slide_content_and_frontend

## Framework/config files

- `docker-compose.yml` (1566 bytes)
- `package.json` (3168 bytes)
- `backend/Dockerfile` (592 bytes)
- `backend/package.json` (917 bytes)
- `backend/prisma/schema.prisma` (5102 bytes)

## References to the six supplied slide assets

- `hero-nuts-bowl.webp`: 8 matching source line(s)
- `hazelnut-spoon.webp`: 10 matching source line(s)
- `tray-pistachio-almond.webp`: 20 matching source line(s)
- `Hero-Banner-main.webp`: 4 matching source line(s)
- `HeroBanner-1.webp`: 4 matching source line(s)
- `Hero-banner-2.webp`: 4 matching source line(s)

## Keyword matches (with line numbers)

### `.github/workflows/deploy.yml`
**admin_and_content_management**
- L50: `- name: Upload build artifact`
- L51: `uses: actions/upload-artifact@v4`

### `AGENTS.md`
**slide_content_and_frontend**
- L60: `- The home product band is three separate self-moving rows, one per category (پسته / بادام / فندق), each a \`ProductLineRow\`. (A single navigable arrow/dot carousel was tried and removed — the user wants per-cat`
**admin_and_content_management**
- L5: `All frontend API calls use relative \`/api/*\` and \`/uploads/*\` URLs, proxied to the backend through Vite's \`server.proxy\` config (single-origin approach). No direct browser-to-backend calls.`
- L23: `- Entity routes (admin): \`/api/entities/:EntityName\` (PascalCase: Product, Category, BlogPost, etc.)`
- L25: `- Admin login: \`admin@7golden.co\` / \`admin123\``
- L47: `- Single-origin wiring: Vite dev server proxies \`/api\` and \`/uploads\` to the backend container. Only port 3000 is public.`
- L49: `- Admin login: \`admin@7golden.co\` / \`admin123\``
- L66: `- Studio food photography downloaded from the user into \`public/banner/\` (hero-nuts-bowl, banner-spoons-set, almond-milk, hazelnut-bowl, pistachio-dishes-teal, banner-four-bowls, hero-chopped-scoop, product-nut`
- L69: `Current public home-page structure is defined in \`src/pages/Home.jsx\`. Product rows appear only when real API products exist; awards come from published CMS records and are omitted if none are available; the ap`
- L100: `## CMS and seed data safety`
**api_and_routes**
- L5: `All frontend API calls use relative \`/api/*\` and \`/uploads/*\` URLs, proxied to the backend through Vite's \`server.proxy\` config (single-origin approach). No direct browser-to-backend calls.`
- L20: `## Backend API`
- L21: `- Health: \`GET /api/health\``
- L22: `- Content routes (public): \`/api/products\`, \`/api/categories\`, \`/api/testimonials\`, \`/api/blog\`, \`/api/gallery\`, \`/api/awards\`, \`/api/settings\`, \`/api/contact\`, \`/api/orders\``
- L23: `- Entity routes (admin): \`/api/entities/:EntityName\` (PascalCase: Product, Category, BlogPost, etc.)`
- L24: `- Auth: \`/api/auth/login\`, \`/api/auth/register\``
- L44: `- API health: \`curl http://localhost:3000/api/health\` (proxied to backend:3001)`
- L47: `- Single-origin wiring: Vite dev server proxies \`/api\` and \`/uploads\` to the backend container. Only port 3000 is public.`
**database_and_models**
- L4: `Fullstack app: Vite + React frontend (port 5173 → mapped to host 3000) + Express/Prisma backend (port 3001) + PostgreSQL 16.`
- L12: `- **backend**: node:22-alpine, bind-mounts \`./backend\`, installs deps + \`apk add openssl\` on startup, runs \`prisma generate && prisma db push && seed\`, then \`tsx watch src/index.ts\` (live reload)`
- L16: `1. **Seed/schema mismatch**: \`backend/prisma/seed.ts\` referenced \`_en\` fields (site_name_en, name_en, desc_en, etc.) that don't exist in \`schema.prisma\` (only \`_fa\` fields exist). Removed all \`_en\` fields from `
- L23: `- Entity routes (admin): \`/api/entities/:EntityName\` (PascalCase: Product, Category, BlogPost, etc.)`
- L31: `- \`backend/schema.prisma\` (root-level copy) is identical to \`backend/prisma/schema.prisma\``
- L36: `- **Backend:** Node.js + Express + Prisma + JWT (port 3001, internal only)`
- L53: `- Backend startup: \`npm install → prisma generate → prisma db push → seed → tsx watch\``
- L58: `- Home product marquees (\`ProductLineRow\`) were blank for several seconds and the middle row often lagged: \`ProductTile\` hardcoded \`loading="lazy"\`, so the below-the-fold slider images only began downloading on`
**migrations_and_seeders**
- L12: `- **backend**: node:22-alpine, bind-mounts \`./backend\`, installs deps + \`apk add openssl\` on startup, runs \`prisma generate && prisma db push && seed\`, then \`tsx watch src/index.ts\` (live reload)`
- L16: `1. **Seed/schema mismatch**: \`backend/prisma/seed.ts\` referenced \`_en\` fields (site_name_en, name_en, desc_en, etc.) that don't exist in \`schema.prisma\` (only \`_fa\` fields exist). Removed all \`_en\` fields from `
- L33: `- \`.bak\` files exist throughout (seed.ts.bak, content.js.bak, etc.) — safe to ignore`
- L53: `- Backend startup: \`npm install → prisma generate → prisma db push → seed → tsx watch\``
- L61: `- \`backend/prisma/seed.ts\` was out of sync with \`schema.prisma\` (referenced removed \`_en\` fields). Fixed to match the current schema (Persian-only fields).`
- L62: `- \`backend/prisma/seed.ts\` had a syntax error in the testimonial block (a \`create({ data: {...} })\` was incorrectly extended with extra object literals, causing \`Expected identifier but found "{"\`). Fixed by sw`
- L63: `- \`backend/prisma/seed.ts\` is now populated with the real 7golden catalog: 20 products (pistachio/almond/hazelnut), 3 categories, and 4 blog posts with Persian content migrated from the old WordPress site expor`
- L100: `## CMS and seed data safety`

### `AuthContext.jsx`
**api_and_routes**
- L2: `import { base44 } from '@/api/base44Client';`

### `DOCKER.md`
**admin_and_content_management**
- L15: `- ایمیل: \`admin@7golden.co\``
**api_and_routes**
- L12: `- Health: http://localhost:3001/api/health`
- L44: `Vite درخواست‌های \`/api\` را به \`localhost:3001\` پروکسی می‌کند.`
- L48: `- **فرانت:** \`src/api/base44Client.js\` فقط به API محلی متصل است. هیچ پکیج \`@base44/*\` در پروژه باقی نمانده.`

### `README.md`
**admin_and_content_management**
- L20: `ادمین API: \`admin@7golden.co\` / \`admin123\``
- L59: `- فایل‌های آپلود در \`UPLOAD_DIR\` (یا S3) ذخیره می‌شوند.`
**api_and_routes**
- L6: `- **Frontend:** React + Vite (proxy \`/api\` → backend)`
- L20: `ادمین API: \`admin@7golden.co\` / \`admin123\``
- L53: `- **فرانت:** \`src/api/base44Client.js\` فقط به API محلی (\`/api/*\`) وصل می‌شود. هیچ پکیج \`@base44/*\` باقی نمانده.`
**database_and_models**
- L7: `- **Backend:** Node.js + Express + Prisma + JWT`

### `apply_7golden_luxury_visual_refinement.py`
**slide_content_and_frontend**
- L334: `image: '/banner/Hero-Banner-main.webp',`
- L335: `imagePosition: 'center 52%',`
- L342: `image: '/banner/HeroBanner-1.webp',`
- L343: `imagePosition: 'center 52%',`
- L350: `image: '/banner/Hero-banner-2.webp',`
- L351: `imagePosition: 'center 54%',`
- L415: `if "const BASE_SLIDES" not in content:`
- L416: `raise RuntimeError("Could not find BASE_SLIDES in src/components/HeroSlider.jsx.")`
**admin_and_content_management**
- L22: `"public/migrated/https___7golden.co_wp-content_uploads_2023_08_logo-white.webp",`
- L438: `f"{indent}// Show a deliberately small five-item selection on the homepage; the admin ordering decides which items lead.\n"`
- L443: `# Navigation and lightbox should only cycle the actually shown selection; other archive assets remain in CMS.`
- L465: `# Keep section copy truthful and calmer when no CMS subtitle has been provided.`
- L557: `mark_only = root / "public/migrated/https___7golden.co_wp-content_uploads_2023_08_logo.webp"`
**api_and_routes**
- L5: `No database, seed, generated API, or user content files are touched.`
- L25: `EDITORIAL_CARD = r'''import { Link } from 'react-router-dom';`
**database_and_models**
- L421: `additions = [slide for slide in SLIDES if slide.split("image: '", 1)[1].split("'", 1)[0] not in body]`
**migrations_and_seeders**
- L5: `No database, seed, generated API, or user content files are touched.`

### `apply_7golden_news_api_home_mosaic.py`
**slide_content_and_frontend**
- L37: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L216: `<DynamicHeroSlider`
- L432: `{ id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L435: `{ id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L438: `{ id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L439: `{ id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L1178: `image: '/banner/hazelnut-spoon.webp',`
- L1201: `{ section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bow`
**admin_and_content_management**
- L2: `"""Apply the 7Golden newsroom/CMS and homepage media mosaic fix.`
- L11: `updates so admin edits are preserved.`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L740: `<StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگز`
- L894: `content = content.replace("    if (req.user?.role !== 'admin') where.slug = { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS };\n", "")`
- L897: `"    if (req.user?.role !== 'admin' && UNVERIFIED_LEGACY_BLOG_SLUGS.includes(req.params.slug)) {\n      return res.status(404).json({ error: 'Not found' });\n    }\n",`
- L899: `"public article detail honors CMS publish status",`
- L986: `// homepage can honor an admin's hide toggle without leaking hidden copy/media.`
**api_and_routes**
- L35: `import { Link } from 'react-router-dom';`
- L45: `import { getNewsMeta, getNewsPosts } from '@/lib/api/content';`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L653: `import { Link } from 'react-router-dom';`
- L657: `import { getNewsPosts } from '@/lib/api/content';`
- L716: `import { Link } from 'react-router-dom';`
- L720: `import { getBlogPosts } from '@/lib/api/content';`
- L887: `content = replace_once(content, "  serializeGeneric,\n  normalizeRowMedia,", "  serializeGeneric,\n  serializeNewsPost,\n  normalizeRowMedia,", "NewsPost routes serializer import")`
**database_and_models**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L775: `"model Award {",`
- L776: `"""model NewsPost {`
- L793: `model Award {""",`
- L794: `"NewsPost Prisma model",`
- L869: `content = replace_once(content, "  | 'blogPost'\n  | 'award'", "  | 'blogPost'\n  | 'newsPost'\n  | 'award'", "NewsPost entity type")`
- L870: `content = replace_once(content, "  BlogPost: 'blogPost',\n  Award:", "  BlogPost: 'blogPost',\n  NewsPost: 'newsPost',\n  Award:", "NewsPost entity map")`
- L874: `"  if (entity === 'Product') out = serializeProduct(row);\n  else if (entity === 'Order') out = serializeOrder(row);\n  else out = serializeGeneric(row);",`
**migrations_and_seeders**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L10: `Schema changes are additive. Seed additions use create-if-missing/upsert with empty`
- L175: `// Preserve the seven existing editorial news items until the first database seed`
- L1127: `"remove legacy slug array from seed",`
- L1132: `"  // Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.\n",`
- L1133: `"stop seed from undoing manual blog publication",`
- L1135: `seed_insert = r'''  // Seed the existing newsroom archive into its own NewsPost collection.`
- L1136: `// Empty updates are deliberate: the seed initializes missing rows but never overwrites`
**test_and_ci**
- L507: `{nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}`

### `apply_7golden_news_api_home_mosaic_fixed.py`
**slide_content_and_frontend**
- L37: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L216: `<DynamicHeroSlider`
- L432: `{ id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L435: `{ id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L438: `{ id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L439: `{ id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L1194: `image: '/banner/hazelnut-spoon.webp',`
- L1217: `{ section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bow`
**admin_and_content_management**
- L2: `"""Apply the 7Golden newsroom/CMS and homepage media mosaic fix.`
- L11: `updates so admin edits are preserved.`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L740: `<StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگز`
- L899: `r"^\s*if \(req\.user\?\.role !== 'admin'\) where\.slug = \{ notIn: UNVERIFIED_LEGACY_BLOG_SLUGS \};\s*$\n?",`
- L906: `r"^\s*if \(req\.user\?\.role !== 'admin' && UNVERIFIED_LEGACY_BLOG_SLUGS\.includes\(req\.params\.slug\)\) \{\s*return res\.status\(404\)\.json\(\{ error: 'Not found' \}\);\s*\}\s*$\n?",`
- L1002: `// homepage can honor an admin's hide toggle without leaking hidden copy/media.`
- L1092: `content = replace_once(content, "{active === 'gallery' && <MediaSection />}\n", "{active === 'gallery' && <MediaSection />}\n      {active === 'news' && <NewsAdminSection />}\n", "News admin route")`
**api_and_routes**
- L35: `import { Link } from 'react-router-dom';`
- L45: `import { getNewsMeta, getNewsPosts } from '@/lib/api/content';`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L653: `import { Link } from 'react-router-dom';`
- L657: `import { getNewsPosts } from '@/lib/api/content';`
- L716: `import { Link } from 'react-router-dom';`
- L720: `import { getBlogPosts } from '@/lib/api/content';`
- L887: `content = replace_once(content, "  serializeGeneric,\n  normalizeRowMedia,", "  serializeGeneric,\n  serializeNewsPost,\n  normalizeRowMedia,", "NewsPost routes serializer import")`
**database_and_models**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L775: `"model Award {",`
- L776: `"""model NewsPost {`
- L793: `model Award {""",`
- L794: `"NewsPost Prisma model",`
- L869: `content = replace_once(content, "  | 'blogPost'\n  | 'award'", "  | 'blogPost'\n  | 'newsPost'\n  | 'award'", "NewsPost entity type")`
- L870: `content = replace_once(content, "  BlogPost: 'blogPost',\n  Award:", "  BlogPost: 'blogPost',\n  NewsPost: 'newsPost',\n  Award:", "NewsPost entity map")`
- L874: `"  if (entity === 'Product') out = serializeProduct(row);\n  else if (entity === 'Order') out = serializeOrder(row);\n  else out = serializeGeneric(row);",`
**migrations_and_seeders**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L10: `Schema changes are additive. Seed additions use create-if-missing/upsert with empty`
- L175: `// Preserve the seven existing editorial news items until the first database seed`
- L1143: `"remove legacy slug array from seed",`
- L1148: `"  // Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.\n",`
- L1149: `"stop seed from undoing manual blog publication",`
- L1151: `seed_insert = r'''  // Seed the existing newsroom archive into its own NewsPost collection.`
- L1152: `// Empty updates are deliberate: the seed initializes missing rows but never overwrites`
**test_and_ci**
- L507: `{nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}`

### `apply_7golden_news_api_home_mosaic_fixed2.py`
**slide_content_and_frontend**
- L37: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L216: `<DynamicHeroSlider`
- L432: `{ id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L435: `{ id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L438: `{ id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L439: `{ id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L1222: `image: '/banner/hazelnut-spoon.webp',`
- L1245: `{ section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bow`
**admin_and_content_management**
- L2: `"""Apply the 7Golden newsroom/CMS and homepage media mosaic fix.`
- L11: `updates so admin edits are preserved.`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L740: `<StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگز`
- L902: `# quote style for the admin role, or whether the if body uses braces.`
- L1030: `// homepage can honor an admin's hide toggle without leaking hidden copy/media.`
- L1120: `content = replace_once(content, "{active === 'gallery' && <MediaSection />}\n", "{active === 'gallery' && <MediaSection />}\n      {active === 'news' && <NewsAdminSection />}\n", "News admin route")`
- L1156: `content = replace_once(content, "function BlogSection() {", news_admin + "function BlogSection() {", "insert News admin form")`
**api_and_routes**
- L35: `import { Link } from 'react-router-dom';`
- L45: `import { getNewsMeta, getNewsPosts } from '@/lib/api/content';`
- L176: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
- L653: `import { Link } from 'react-router-dom';`
- L657: `import { getNewsPosts } from '@/lib/api/content';`
- L716: `import { Link } from 'react-router-dom';`
- L720: `import { getBlogPosts } from '@/lib/api/content';`
- L887: `content = replace_once(content, "  serializeGeneric,\n  normalizeRowMedia,", "  serializeGeneric,\n  serializeNewsPost,\n  normalizeRowMedia,", "NewsPost routes serializer import")`
**database_and_models**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L775: `"model Award {",`
- L776: `"""model NewsPost {`
- L793: `model Award {""",`
- L794: `"NewsPost Prisma model",`
- L869: `content = replace_once(content, "  | 'blogPost'\n  | 'award'", "  | 'blogPost'\n  | 'newsPost'\n  | 'award'", "NewsPost entity type")`
- L870: `content = replace_once(content, "  BlogPost: 'blogPost',\n  Award:", "  BlogPost: 'blogPost',\n  NewsPost: 'newsPost',\n  Award:", "NewsPost entity map")`
- L874: `"  if (entity === 'Product') out = serializeProduct(row);\n  else if (entity === 'Order') out = serializeOrder(row);\n  else out = serializeGeneric(row);",`
**migrations_and_seeders**
- L9: `runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.`
- L10: `Schema changes are additive. Seed additions use create-if-missing/upsert with empty`
- L175: `// Preserve the seven existing editorial news items until the first database seed`
- L1171: `"remove legacy slug array from seed",`
- L1176: `"  // Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.\n",`
- L1177: `"stop seed from undoing manual blog publication",`
- L1179: `seed_insert = r'''  // Seed the existing newsroom archive into its own NewsPost collection.`
- L1180: `// Empty updates are deliberate: the seed initializes missing rows but never overwrites`
**test_and_ci**
- L507: `{nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}`

### `apply_7golden_news_blog_fixes.py`
**slide_content_and_frontend**
- L19: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L80: `<DynamicHeroSlider`
**api_and_routes**
- L17: `import { Link } from 'react-router-dom';`
- L504: `/* Never wrap page or card titles on these editorial routes. Excerpts and article`
- L584: `'<Route path="/news/:slug" element={<BlogPost />} />',`
- L585: `'<Route path="/news/:slug" element={<NewsArticle />} />',`
- L586: `"separate news detail route",`

### `apply_7golden_news_blog_followup.py`
**admin_and_content_management**
- L10: `CMS content. It only updates frontend/API limits, the newsroom's data source, and`
- L37: `"news CMS API import",`
- L75: `// Keep the verified newsroom notices visible, but signal a CMS/API failure.`
- L84: `"news CMS loading state",`
- L122: `source: 'cms',`
- L126: `// public CMS blog records. A matching slug is shown once, with CMS content first.`
- L163: `content = replace_once(content, start, replacement, "news items/categories derived from CMS + authored news")`
- L180: `"news CMS error status",`
**api_and_routes**
- L10: `CMS content. It only updates frontend/API limits, the newsroom's data source, and`
- L36: `"import { SITE_SEO } from '@/lib/seo';\nimport { getBlogPosts } from '@/lib/api/content';\n",`
- L37: `"news CMS API import",`
- L75: `// Keep the verified newsroom notices visible, but signal a CMS/API failure.`
- L223: `"router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {\n  try {\n    const limit = Math.min(Number(req.query.limit) || 100, 500);",`
- L224: `"router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {\n  try {\n    const limit = Math.min(Number(req.query.limit) || 500, 500);",`
- L417: `"src/lib/api/content.js": update_content_api,`
- L418: `"backend/src/routes/content.ts": update_backend_content_route,`
**migrations_and_seeders**
- L9: `not connect to the database, run the seed, change published records, or overwrite`
- L447: `print("\nNo database records or seed data were modified.")`

### `apply_7golden_pagination_sidebar_fix.py`
**admin_and_content_management**
- L2: `"""Safely fix 7Golden blog pagination, CMS-only articles, and editorial responsiveness.`
- L10: `for CMS BlogPost records and an IntersectionObserver infinite-scroll loader.`
- L36: `"remove unneeded CMS newsroom hooks",`
- L42: `"remove incorrect CMS blog import from newsroom",`
- L44: `# The helper was introduced solely to label CMS posts in /news.`
- L49: `raise RuntimeError("Could not find the end of the temporary newsroom CMS label helper.")`
- L52: `# Remove the temporary CMS state and fetch effect; keep active category/search state.`
- L66: `raise RuntimeError("Could not locate the temporary CMS-driven newsroom data block.")`
**api_and_routes**
- L40: `"import { getBlogPosts } from '@/lib/api/content';\n",`
- L112: `"""Do not let BlogPost CMS rows alter newsroom routes or category presentation."""`
- L159: `return replace_once(content, old, new, "CMS blog API pagination and metadata")`
- L164: `router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {`
- L180: `router.get('/blog/:slug', optionalAuth, async (req: AuthRequest, res) => {`
- L184: `router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {`
- L217: `// Keep this route before /blog/:slug so "meta" is not treated as an article slug.`
- L218: `router.get('/blog/meta', optionalAuth, async (req: AuthRequest, res) => {`
**database_and_models**
- L169: `const items = await prisma.blogPost.findMany({`
- L204: `const items = await prisma.blogPost.findMany({`
- L224: `prisma.blogPost.count({ where }),`
- L225: `prisma.blogPost.groupBy({`
- L764: `forbidden = [p for p in updated if p.name == "seed.ts" or p.name == "schema.prisma"]`
- L780: `print("Seed, Prisma schema, and existing database records were not modified.")`
**migrations_and_seeders**
- L8: `This patch does NOT run seeds, alter seed/schema files, delete database records, or`
- L763: `# Validate that this remains a frontend + API patch: seed and schema files are deliberately untouched.`
- L764: `forbidden = [p for p in updated if p.name == "seed.ts" or p.name == "schema.prisma"]`
- L766: `raise RuntimeError(f"Safety check failed; seed/schema files cannot be changed: {forbidden}")`
- L771: `print(f"Dry run passed: {len(updated)} files would change. Seed and schema are untouched.")`
- L780: `print("Seed, Prisma schema, and existing database records were not modified.")`

### `audit_7golden_hero_slider.py`
**slide_content_and_frontend**
- L2: `"""Read-only inventory of 7Golden's hero slider/admin/database implementation.`
- L5: `python3 audit_7golden_hero_slider.py /path/to/7golden --output hero-slider-audit.md`
- L48: `r"HeroBanner-1\.webp", r"Hero-banner-2\.webp", r"imagePosition",`
- L49: `r"hero.?slides?", r"hero.?slider", r"carousel", r"swiper",`
- L63: `r"\b(slide|slider|hero_slide|hero_slides)\b",`
- L157: `path_signal = bool(re.search(r"hero|slider|slide|carousel|admin|migration|seeder|seed|prisma|schema|route|controller|model|api", rel, re.I))`
- L180: `"hero-nuts-bowl.webp", "hazelnut-spoon.webp", "tray-pistachio-almond.webp",`
- L181: `"Hero-Banner-main.webp", "HeroBanner-1.webp", "Hero-banner-2.webp",`
**admin_and_content_management**
- L2: `"""Read-only inventory of 7Golden's hero slider/admin/database implementation.`
- L25: `".cache", "tmp", "temp", "storage", "uploads", "public/assets",`
- L51: `"admin_and_content_management": [`
- L53: `r"manage.?slides?", r"upload", r"multipart/form-data", r"multer",`
- L100: `"likely_admin": ("admin", "dashboard", "cms", "backoffice"),`
- L157: `path_signal = bool(re.search(r"hero|slider|slide|carousel|admin|migration|seeder|seed|prisma|schema|route|controller|model|api", rel, re.I))`
- L197: `"admin_and_content_management": 3,`
- L205: `if re.search(r"admin|migration|seeder|seed|schema|model|controller|route", rel, re.I):`
**api_and_routes**
- L56: `r"\b(api|router|routes?)\b", r"app\.(get|post|put|patch|delete)\s*\(",`
- L57: `r"router\.(get|post|put|patch|delete)\s*\(", r"createRouter",`
- L58: `r"NestFactory", r"Controller\(", r"Route::(get|post|put|patch|delete)",`
- L101: `"likely_backend": ("backend", "server", "api/", "routes/", "controllers", "services/"),`
- L157: `path_signal = bool(re.search(r"hero|slider|slide|carousel|admin|migration|seeder|seed|prisma|schema|route|controller|model|api", rel, re.I))`
- L169: `snippet = re.sub(r"(?i)(password|secret|token|api[_-]?key)\s*[:=]\s*[^,;\s]+", r"\1=[REDACTED]", line.strip())`
- L205: `if re.search(r"admin|migration|seeder|seed|schema|model|controller|route", rel, re.I):`
**database_and_models**
- L2: `"""Read-only inventory of 7Golden's hero slider/admin/database implementation.`
- L5: `python3 audit_7golden_hero_slider.py /path/to/7golden --output hero-slider-audit.md`
- L36: `".java", ".kt", ".sql", ".prisma", ".graphql", ".gql", ".sh", ".xml",`
- L49: `r"hero.?slides?", r"hero.?slider", r"carousel", r"swiper",`
- L52: `r"\badmin\b", r"\bCMS\b", r"content.?management", r"slider.?management",`
- L61: `r"\b(prisma|sequelize|typeorm|mongoose|drizzle|knex)\b", r"\bmodel\b",`
- L62: `r"schema\.prisma", r"CREATE TABLE", r"\bmodels?/", r"\bentity\b",`
- L63: `r"\b(slide|slider|hero_slide|hero_slides)\b",`
**migrations_and_seeders**
- L62: `r"schema\.prisma", r"CREATE TABLE", r"\bmodels?/", r"\bentity\b",`
- L66: `r"\bmigrations?\b", r"\bseeders?\b", r"\bseed\b", r"prisma\s+db\s+seed",`
- L67: `r"MigrationInterface", r"Schema::create", r"CREATE TABLE",`
- L102: `"likely_migration_or_seed": ("migration", "migrations", "seeder", "seeders", "/seed", "prisma/seed"),`
- L157: `path_signal = bool(re.search(r"hero|slider|slide|carousel|admin|migration|seeder|seed|prisma|schema|route|controller|model|api", rel, re.I))`
- L205: `if re.search(r"admin|migration|seeder|seed|schema|model|controller|route", rel, re.I):`
**test_and_ci**
- L23: `".next", ".nuxt", ".output", "coverage", "playwright-report",`
- L71: `r"vitest", r"jest", r"playwright", r"\.github/workflows",`

### `backend/Dockerfile`
**admin_and_content_management**
- L15: `RUN mkdir -p /app/uploads`
- L20: `ENV UPLOAD_DIR="/app/uploads"`
**database_and_models**
- L10: `COPY prisma ./prisma`
- L14: `RUN npx prisma generate`
- L26: `CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts; npx tsx src/index.ts"]`
**migrations_and_seeders**
- L26: `CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts; npx tsx src/index.ts"]`

### `backend/HOW_TO_RUN.md`
**admin_and_content_management**
- L58: `- ایمیل: admin@7golden.co`
- L71: `- POST /api/upload (admin)`
**api_and_routes**
- L62: `- GET /api/health`
- L63: `- GET /api/products | /api/products/:slug`
- L64: `- GET /api/categories | /api/blog | /api/blog/:slug`
- L65: `- GET /api/testimonials | /api/gallery | /api/awards`
- L66: `- POST /api/contact`
- L67: `- GET /api/settings`
- L68: `- POST /api/orders | GET /api/orders`
- L69: `- /api/entities/:Entity  (CRUD)`
**database_and_models**
- L41: `در \`prisma/schema.prisma\` موقتاً:`
- L43: `\`\`\`prisma`
- L69: `- /api/entities/:Entity  (CRUD)`

### `backend/README.md`
**admin_and_content_management**
- L14: `## Admin`
- L16: `- Email: \`admin@7golden.co\``
- L38: `| GET | \`/api/orders\` | List (own or admin) |`
- L39: `| GET/POST/PUT/DELETE | \`/api/entities/:Entity\` | Generic CRUD (admin for writes) |`
- L40: `| POST | \`/api/upload\` | Admin file upload |`
**api_and_routes**
- L3: `Standalone Express + Prisma API replacing Base44 for the 7Golden project.`
- L23: `| GET | \`/api/health\` | Health check |`
- L24: `| POST | \`/api/auth/register\` | Register |`
- L25: `| POST | \`/api/auth/login\` | Login → \`{ access_token, user }\` |`
- L26: `| GET | \`/api/auth/me\` | Bearer token |`
- L27: `| GET | \`/api/products\` | Public published products |`
- L28: `| GET | \`/api/products/:slug\` | By slug |`
- L29: `| GET | \`/api/categories\` | Categories |`
**database_and_models**
- L3: `Standalone Express + Prisma API replacing Base44 for the 7Golden project.`
- L39: `| GET/POST/PUT/DELETE | \`/api/entities/:Entity\` | Generic CRUD (admin for writes) |`
- L45: `See \`.env.example\`. Default SQLite at \`prisma/dev.db\`. For production set \`DATABASE_URL\` to PostgreSQL.`
**migrations_and_seeders**
- L10: `npm run db:setup   # generate + push schema + seed`

### `backend/fix-desc.mjs`
**database_and_models**
- L2: `import { PrismaClient } from '@prisma/client';`
- L3: `const prisma = new PrismaClient();`
- L31: `const r = await prisma.product.updateMany({ where: { slug }, data: { desc_fa } });`
- L38: `main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());`

### `backend/package.json`
**admin_and_content_management**
- L21: `"multer": "^2.4.0",`
- L30: `"@types/multer": "^1.4.12",`
**database_and_models**
- L9: `"db:generate": "prisma generate",`
- L10: `"db:push": "prisma db push",`
- L11: `"db:seed": "tsx prisma/seed.ts",`
- L12: `"db:setup": "prisma generate && prisma db push && tsx prisma/seed.ts"`
- L15: `"@prisma/client": "^6.5.0",`
- L32: `"prisma": "^6.5.0",`
**migrations_and_seeders**
- L11: `"db:seed": "tsx prisma/seed.ts",`
- L12: `"db:setup": "prisma generate && prisma db push && tsx prisma/seed.ts"`

### `backend/prisma/schema.prisma`
**database_and_models**
- L2: `provider = "prisma-client-js"`
- L10: `model User {`
- L22: `model Product {`
- L44: `model Category {`
- L55: `model BlogPost {`
- L70: `model NewsPost {`
- L87: `model Award {`
- L98: `model GalleryImage {`

### `backend/prisma/seed.ts`
**slide_content_and_frontend**
- L570: `image: '/banner/hazelnut-spoon.webp',`
- L593: `{ section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bow`
**admin_and_content_management**
- L52: `where: { email: 'admin@7golden.co' },`
- L55: `email: 'admin@7golden.co',`
- L57: `name: 'Admin',`
- L58: `role: 'admin',`
- L62: `// ── Site Settings: initialize defaults once; preserve all later CMS edits ──`
- L415: `// Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.`
- L529: `// later title/body/publish edits made in the admin panel.`
- L590: `// Create the homepage's editable section records once. Existing admin edits,`
**database_and_models**
- L1: `import { PrismaClient } from '@prisma/client';`
- L4: `const prisma = new PrismaClient();`
- L51: `await prisma.user.upsert({`
- L63: `const existingSettings = await prisma.siteSettings.findFirst();`
- L65: `await prisma.siteSettings.create({`
- L110: `await prisma.category.upsert({`
- L408: `await prisma.product.upsert({`
- L520: `await prisma.award.upsert({`
**migrations_and_seeders**
- L415: `// Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.`
- L527: `// Seed the existing newsroom archive into its own NewsPost collection.`
- L528: `// Empty updates are deliberate: the seed initializes missing rows but never overwrites`
- L591: `// including published=false, are never overwritten by this seed.`
- L621: `console.log('Seed done. Admin: admin@7golden.co / admin123');`

### `backend/seed-catalog.mjs`
**database_and_models**
- L2: `import { PrismaClient } from '@prisma/client';`
- L3: `const prisma = new PrismaClient();`
- L29: `await prisma.product.deleteMany({});`
- L31: `await prisma.product.create({`
- L58: `await prisma.category.upsert({`
- L64: `console.log('TOTAL', await prisma.product.count());`
- L69: `.finally(() => prisma.$disconnect());`

### `backend/src/app.ts`
**admin_and_content_management**
- L7: `import uploadRoutes from './routes/upload.js';`
- L20: `const uploadsPath = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));`
- L21: `app.use('/uploads', express.static(uploadsPath, { maxAge: '7d', fallthrough: false }));`
- L22: `console.log('Serving uploads from', uploadsPath);`
- L39: `app.use('/api/upload', uploadRoutes);`
**api_and_routes**
- L4: `import authRoutes from './routes/auth.js';`
- L5: `import entitiesRoutes from './routes/entities.js';`
- L6: `import contentRoutes from './routes/content.js';`
- L7: `import uploadRoutes from './routes/upload.js';`
- L8: `import sitemapRoutes from './routes/sitemap.js';`
- L24: `app.get('/api/health', (_req, res) => {`
- L29: `app.get('/api/apps/public/:env/public-settings/by-id/:id', (req, res) => {`
- L32: `app.get('/api/apps/:appId/public-settings', (_req, res) => {`

### `backend/src/index.ts`
**api_and_routes**
- L8: `console.log(\`Health: http://localhost:${PORT}/api/health\`);`

### `backend/src/lib/prisma.ts`
**database_and_models**
- L1: `import { PrismaClient } from '@prisma/client';`
- L3: `const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };`
- L5: `export const prisma = globalForPrisma.prisma ?? new PrismaClient();`
- L7: `if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;`
- L9: `export default prisma;`

### `backend/src/lib/serialize.ts`
**admin_and_content_management**
- L59: `// corporate site: no shop fields required from admin`
- L102: `// map admin UI fields → schema`
- L118: `/** Force relative upload URLs (never :3001 public) */`
- L124: `if (u.startsWith('/uploads/') || u.startsWith('/product/') || u.startsWith('/banner/') || u.startsWith('/certificates/')) {`
- L128: `if (u.includes('/uploads/')) {`
- L129: `const i = u.indexOf('/uploads/');`
- L145: `/** On read: fix bad absolute upload URLs in API responses */`
- L201: `/** Map aliases from admin UI → schema names */`
**api_and_routes**
- L1: `/** Parse JSON string fields back to objects for API responses */`
- L145: `/** On read: fix bad absolute upload URLs in API responses */`
**database_and_models**
- L170: `/** Allowed writable fields per Prisma model (no id/timestamps) */`
- L202: `export function applyFieldAliases(entity: string, body: any) {`
- L204: `if (entity === 'SiteSettings') {`
- L219: `if (entity === 'BlogPost') {`
- L227: `if (entity === 'Testimonial') {`
- L234: `/** Keep only fields that exist on the model */`
- L235: `export function pickAllowedFields(entity: string, body: any) {`
- L236: `const allowed = ENTITY_WRITE_FIELDS[entity];`

### `backend/src/middleware/auth.ts`
**admin_and_content_management**
- L38: `if (!req.user || req.user.role !== 'admin') {`
- L39: `return res.status(403).json({ error: 'Admin only' });`
**database_and_models**
- L3: `import prisma from '../lib/prisma.js';`
- L29: `const user = await prisma.user.findUnique({ where: { id: payload.userId } });`

### `backend/src/routes/auth.ts`
**api_and_routes**
- L1: `import { Router } from 'express';`
- L7: `const router = Router();`
- L15: `router.post('/register', async (req, res) => {`
- L41: `router.post('/login', async (req, res) => {`
- L59: `router.post('/logout', (_req, res) => {`
- L63: `router.get('/me', requireAuth, async (req: AuthRequest, res) => {`
- L69: `router.patch('/me', requireAuth, async (req: AuthRequest, res) => {`
- L82: `export default router;`
**database_and_models**
- L3: `import prisma from '../lib/prisma.js';`
- L18: `const existing = await prisma.user.findUnique({ where: { email: body.email } });`
- L22: `const user = await prisma.user.create({`
- L44: `const user = await prisma.user.findUnique({ where: { email: body.email } });`
- L64: `const user = await prisma.user.findUnique({ where: { id: req.user!.id } });`
- L72: `const user = await prisma.user.update({`

### `backend/src/routes/content.ts`
**admin_and_content_management**
- L63: `// Blog: the database/CMS is the source of truth. Pagination is offset-based,`
- L203: `if (req.user?.role !== 'admin') where.name_fa = { notIn: UNVERIFIED_TESTIMONIAL_NAMES };`
- L264: `// homepage can honor an admin's hide toggle without leaking hidden copy/media.`
- L326: `if (req.user!.role !== 'admin') where.userId = req.user!.id;`
**api_and_routes**
- L1: `import { Router } from 'express';`
- L13: `const router = Router();`
- L24: `router.get('/products', async (req, res) => {`
- L41: `router.get('/products/:slug', async (req, res) => {`
- L54: `router.get('/categories', async (_req, res) => {`
- L65: `router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {`
- L96: `// Keep this route before /blog/:slug so "meta" is not treated as an article slug.`
- L97: `router.get('/blog/meta', optionalAuth, async (req: AuthRequest, res) => {`
**database_and_models**
- L2: `import prisma from '../lib/prisma.js';`
- L30: `const items = await prisma.product.findMany({`
- L43: `const item = await prisma.product.findFirst({`
- L56: `const items = await prisma.category.findMany({ orderBy: { sort_order: 'asc' }, take: 100 });`
- L83: `const items = await prisma.blogPost.findMany({`
- L101: `prisma.blogPost.count({ where }),`
- L102: `prisma.blogPost.groupBy({`
- L123: `const item = await prisma.blogPost.findFirst({`

### `backend/src/routes/entities.ts`
**admin_and_content_management**
- L129: `const isAdmin = req.user?.role === 'admin';`
- L135: `return res.status(403).json({ error: 'Admin only' });`
- L142: `return res.status(403).json({ error: 'Admin only' });`
- L176: `const isAdmin = req.user?.role === 'admin';`
- L178: `return res.status(403).json({ error: 'Admin only' });`
- L206: `if (HAS_PUBLISHED.has(entity) && !(row as any).published && req.user?.role !== 'admin') {`
- L209: `if (entity === 'ContactMessage' && req.user?.role !== 'admin') {`
- L210: `return res.status(403).json({ error: 'Admin only' });`
**api_and_routes**
- L1: `import { Router } from 'express';`
- L20: `const router = Router();`
- L122: `router.get('/entities/:entity', optionalAuth, async (req: AuthRequest, res) => {`
- L170: `router.post('/entities/:entity', optionalAuth, async (req: AuthRequest, res) => {`
- L186: `return res.status(400).json({ error: 'Use /api/auth/register' });`
- L197: `router.get('/entities/:entity/:id', optionalAuth, async (req: AuthRequest, res) => {`
- L231: `router.put('/entities/:entity/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {`
- L251: `router.delete('/entities/:entity/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {`
**database_and_models**
- L2: `import prisma from '../lib/prisma.js';`
- L56: `return (prisma as any)[name];`
- L90: `function serialize(entity: string, row: any) {`
- L92: `if (entity === 'Product') out = serializeProduct(row);`
- L93: `else if (entity === 'Order') out = serializeOrder(row);`
- L94: `else if (entity === 'NewsPost') out = serializeNewsPost(row);`
- L99: `function prepare(entity: string, body: any) {`
- L100: `let data: any = applyFieldAliases(entity, body || {});`

### `backend/src/routes/sitemap.ts`
**api_and_routes**
- L1: `import { Router } from 'express';`
- L4: `const router = Router();`
- L37: `router.get('/sitemap.xml', async (_req, res) => {`
- L69: `export default router;`
**database_and_models**
- L2: `import prisma from '../lib/prisma.js';`
- L40: `prisma.product.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 500 }),`
- L41: `prisma.blogPost.findMany({ where: { published: true, slug: { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS } }, orderBy: { updatedAt: 'desc' }, take: 500 }),`

### `backend/src/routes/upload.ts`
**admin_and_content_management**
- L2: `import multer from 'multer';`
- L8: `const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));`
- L9: `if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });`
- L11: `const upload = multer({`
- L12: `storage: multer.memoryStorage(),`
- L23: `upload.single('file')(req, res, async (err: any) => {`
- L25: `if (err) return res.status(400).json({ error: err.message || 'Upload failed' });`
- L36: `let outPath = path.join(uploadDir, filename);`
**api_and_routes**
- L1: `import { Router } from 'express';`
- L20: `const router = Router();`
- L22: `router.post('/', requireAuth, requireAdmin, (req: AuthRequest, res) => {`
- L68: `export default router;`
**test_and_ci**
- L15: `if (!/^image\//i.test(file.mimetype)) return cb(new Error('فقط تصویر مجاز است'));`

### `backend/tsconfig.json`
**database_and_models**
- L13: `"include": ["src/**/*", "prisma/**/*"]`

### `base44Client.js`
**admin_and_content_management**
- L168: `async UploadFile({ file }) {`
- L172: `const res = await fetch(\`${API}/upload\`, {`
- L178: `if (!res.ok) throw new Error(data.error || \`Upload failed (${res.status})\`);`
**api_and_routes**
- L3: `* Talks only to the project's own backend (/api/*). Zero external Base44 dependency.`
- L6: `const API = '/api';`
- L33: `const res = await fetch(\`${API}${path}\`, {`
- L172: `const res = await fetch(\`${API}/upload\`, {`
**database_and_models**
- L131: `throw new Error(\`Entity ${entityName} list failed\`);`

### `content.js`
**api_and_routes**
- L2: `* 7Golden content API — talks to local backend (/api/*) via Vite proxy.`
- L6: `const API = '/api';`
- L9: `const res = await fetch(\`${API}${path}\`);`
- L18: `const res = await fetch(\`${API}${path}\`, {`
- L203: `const res = await fetch(\`${API}/orders\`, {`

### `docker-compose.base44.yml`
**admin_and_content_management**
- L27: `- UPLOAD_DIR=/app/uploads`
- L32: `- backend-uploads:/app/uploads`
- L69: `backend-uploads:`
**api_and_routes**
- L38: `test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3001/api/health"]`
**database_and_models**
- L36: `command: ["sh", "-ec", "apk add --no-cache openssl wget && npm install && npx prisma generate --schema=prisma/schema.prisma && npx prisma db push --schema=prisma/schema.prisma && npx tsx prisma/seed.ts && exec `
**migrations_and_seeders**
- L36: `command: ["sh", "-ec", "apk add --no-cache openssl wget && npm install && npx prisma generate --schema=prisma/schema.prisma && npx prisma db push --schema=prisma/schema.prisma && npx tsx prisma/seed.ts && exec `

### `docker-compose.yml`
**admin_and_content_management**
- L31: `UPLOAD_DIR: "/app/uploads"`
- L34: `- backend-uploads:/app/uploads`
- L64: `backend-uploads:`
**api_and_routes**
- L39: `test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3001/api/health"]`

### `fix_7golden_admin_blog_upload.py`
**admin_and_content_management**
- L2: `"""Patch 7Golden admin NewsPost registration, rich text display/editor, scrolling and upload size.`
- L44: `"src/pages/Admin.jsx",`
- L49: `'<div className="admin-shell flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">',`
- L50: `"make desktop admin a viewport-height shell with internal scrolling",`
- L51: `"src/pages/Admin.jsx",`
- L56: `'<aside className="admin-sidebar lg:w-64 flex-shrink-0 lg:h-screen lg:overflow-y-auto"',`
- L57: `"allow the admin navigation itself to scroll",`
- L58: `"src/pages/Admin.jsx",`
**api_and_routes**
- L35: `return replace_once(text, old, new, "register NewsPost in local entity adapter", "src/api/base44Client.js")`
- L104: `"backend/src/routes/upload.ts",`
- L126: `text = replace_once(text, "function normalizeBlogPost(r) {", helper + "function normalizeBlogPost(r) {", "add plain-text normalization for excerpts", "src/lib/api/content.js")`
- L127: `text = replace_once(text, "    excerptFA: r.excerpt_fa,", "    excerptFA: plainText(r.excerpt_fa),", "strip HTML from Persian blog excerpts", "src/lib/api/content.js")`
- L128: `text = replace_once(text, "    excerptEN: r.excerpt_en,", "    excerptEN: plainText(r.excerpt_en),", "strip HTML from English blog excerpts", "src/lib/api/content.js")`
- L353: `if not (root / "src/pages/Admin.jsx").is_file() or not (root / "backend/src/routes/upload.ts").is_file():`
- L358: `("src/api/base44Client.js", patch_base44_client),`
- L361: `("src/lib/api/content.js", patch_api_content),`
**database_and_models**
- L35: `return replace_once(text, old, new, "register NewsPost in local entity adapter", "src/api/base44Client.js")`
- L411: `print("If uploads still fail with HTTP 413 / Request Entity Too Large, set the external reverse proxy's request-body limit to at least 20M too.")`
**test_and_ci**
- L175: `return HTML_CONTENT_TAG.test(String(value || ''));`
- L180: `if (!raw || /[\u0000-\u001f]/.test(raw)) return false;`

### `fix_7golden_rich_content_home_media.py`
**admin_and_content_management**
- L2: `"""Repair mixed HTML/Markdown CMS article content and calm the homepage media grid.`
- L35: `// Some CMS records contain escaped tags (\<p>, &lt;p&gt;, or &amp;lt;p&amp;gt;) rather than real markup.`
- L422: `# CMS-authored content should remain rich, rather than being flattened into plain paragraphs.`
- L435: `text = replace_once(text, old, new, "preserve CMS news rich text", "src/pages/NewsArticle.jsx")`
- L437: `raise RuntimeError("src/pages/NewsArticle.jsx: CMS content loader is in an unknown form; no files have been written.")`
- L439: `# Remove the old tag-stripper once the shared renderer owns CMS article content.`
- L460: `# Render rich CMS content but keep the legacy article sections/photos/videos exactly as before.`
- L599: `print('  - Decodes escaped/double-escaped HTML entities and converts collapsed Markdown headings, bold text, and bullets in CMS article content.')`
**api_and_routes**
- L346: `raise RuntimeError("src/lib/api/content.js: found plainText but could not replace its body safely.")`
- L348: `text = replace_once(text, "function normalizeBlogPost(r) {", helper + "function normalizeBlogPost(r) {", "insert plain-text normalizer", "src/lib/api/content.js")`
- L359: `raise RuntimeError("src/lib/api/content.js: couldn't identify the NewsPost excerpt field.")`
- L568: `('src/lib/api/content.js', patch_api_content),`
**migrations_and_seeders**
- L603: `print('  - Does not modify database records, seed content, or delete media assets.')`
**test_and_ci**
- L40: `if (ENCODED_HTML_TAG.test(source)) {`
- L62: `const block = /^(p|div|section|article|h[1-6]|ul|ol|li|blockquote|pre|tr)$/.test(tag);`
- L137: `return /(?:^|\s)#{1,6}\s+/u.test(text)`
- L138: `|| /\*\*[^*\n]+\*\*/u.test(text)`
- L139: `|| /(?:^|\s)-\s+\*\*/u.test(text);`
- L144: `if (!raw || /[\u0000-\u001f]/u.test(raw)) return false;`
- L191: `if (typeof DOMParser !== 'undefined' && HTML_TAG.test(source)) {`
- L320: `if (/&lt;\/?(?:p|div|h[1-6]|ul|ol|li|strong|br)\b/i.test(source)) {`

### `index.html`
**slide_content_and_frontend**
- L37: `<!-- Hero image priority is assigned by HeroSlider so a CMS-selected image is respected. -->`
**admin_and_content_management**
- L37: `<!-- Hero image priority is assigned by HeroSlider so a CMS-selected image is respected. -->`

### `jsconfig.json`
**api_and_routes**
- L20: `"exclude": ["node_modules", "dist", "src/vite-plugins", "src/components/ui", "src/api", "src/lib"]`

### `package.json`
**slide_content_and_frontend**
- L52: `"embla-carousel-react": "^8.5.2",`
**api_and_routes**
- L70: `"react-router-dom": "^7.18.3",`
**database_and_models**
- L36: `"@radix-ui/react-slider": "^1.2.3",`

### `src/App.jsx`
**admin_and_content_management**
- L22: `const Admin = lazy(() => import('@/pages/Admin'));`
- L66: `<Route path="/admin" element={<Admin />} />`
**api_and_routes**
- L5: `import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';`
- L50: `<Routes>`
- L51: `<Route path="/" element={<Home />} />`
- L52: `<Route path="/shop" element={<Shop />} />`
- L53: `<Route path="/product/:id" element={<ProductDetail />} />`
- L54: `{/* Retail routes disabled — 7Golden has no online checkout or customer account area. */}`
- L55: `{/* <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>`
- L56: `<Route path="/checkout" element={<Checkout />} />`

### `src/api/base44Client.js`
**admin_and_content_management**
- L3: `* Public pages use src/lib/api/content.js; admin still calls base44.entities.*`
- L113: `UploadFile: async ({ file }) => {`
- L116: `const res = await fetch('/api/upload', {`
- L122: `if (!res.ok) throw new Error(data.error || 'Upload failed');`
**api_and_routes**
- L2: `* Local API adapter — replaces @base44/sdk.`
- L3: `* Public pages use src/lib/api/content.js; admin still calls base44.entities.*`
- L13: `const res = await fetch(\`/api${path}\`, {`
- L70: `fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});`
- L116: `const res = await fetch('/api/upload', {`

### `src/api/content.js`
**api_and_routes**
- L2: `* 7Golden content API — talks to local backend (/api/*) via Vite proxy.`
- L6: `const API = '/api';`
- L9: `const res = await fetch(\`${API}${path}\`);`
- L18: `const res = await fetch(\`${API}${path}\`, {`
- L204: `const res = await fetch(\`${API}/orders\`, {`

### `src/components/AwardsSection.jsx`
**api_and_routes**
- L3: `import { getAwards } from '@/lib/api/content';`

### `src/components/BackButton.jsx`
**api_and_routes**
- L2: `import { useNavigate } from 'react-router-dom';`

### `src/components/BottomTabBar.jsx`
**api_and_routes**
- L2: `import { useNavigate, useLocation } from 'react-router-dom';`

### `src/components/BusinessCTA.jsx`
**slide_content_and_frontend**
- L15: `src="/banner/tray-pistachio-almond.webp"`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/CartDrawer.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/CinematicHero.jsx`
**slide_content_and_frontend**
- L18: `image = '/banner/hero-nuts-bowl.webp',`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/DynamicHeroSlider.jsx`
**slide_content_and_frontend**
- L10: `export default function DynamicHeroSlider({`
**api_and_routes**
- L3: `import { getPageHeroes } from '@/lib/api/content';`

### `src/components/EditorialCard.jsx`
**api_and_routes**
- L1: `import { Link } from 'react-router-dom';`

### `src/components/Footer.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/HeroSlider.jsx`
**slide_content_and_frontend**
- L5: `const BASE_SLIDES = [`
- L7: `image: '/banner/hero-nuts-bowl.webp',`
- L8: `imagePosition: 'center 54%',`
- L15: `image: '/banner/hazelnut-spoon.webp',`
- L16: `imagePosition: 'center 48%',`
- L23: `image: '/banner/tray-pistachio-almond.webp',`
- L24: `imagePosition: 'center 52%',`
- L31: `image: '/banner/Hero-Banner-main.webp',`
**api_and_routes**
- L3: `import { Link } from 'react-router-dom';`
**database_and_models**
- L57: `const slides = useMemo(() => BASE_SLIDES.map((slide, index) => {`
- L58: `if (index !== 0 || !cmsHero) return slide;`
- L60: `...slide,`
- L61: `image: typeof cmsHero.image === 'string' && cmsHero.image.trim() ? cmsHero.image.trim() : slide.image,`
- L62: `badge: cmsHero.badge_fa || cmsHero.badge || slide.badge,`
- L63: `title: cmsHero.title_fa || slide.title,`
- L64: `accent: cmsHero.title_fa ? (cmsHero.title_accent_fa || '') : slide.accent,`
- L65: `description: cmsHero.subtitle_fa || slide.description,`

### `src/components/MainProducts.jsx`
**admin_and_content_management**
- L21: `* Images come from the matching Category entity, so they stay editable in the CMS.`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
**database_and_models**
- L21: `* Images come from the matching Category entity, so they stay editable in the CMS.`

### `src/components/MobileMenu.jsx`
**api_and_routes**
- L2: `import { Link, useLocation } from 'react-router-dom';`
**database_and_models**
- L25: `* MobileMenu — slide-in sheet used below the \`lg\` breakpoint.`

### `src/components/Navbar.jsx`
**api_and_routes**
- L2: `import { Link, useLocation } from 'react-router-dom';`
**database_and_models**
- L12: `* collapses into the slide-in sheet. (Retail cart / account controls are`

### `src/components/PageTransition.jsx`
**api_and_routes**
- L1: `import { useLocation } from 'react-router-dom';`

### `src/components/ProductCard.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/ProductCardRound.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/ProductTile.jsx`
**api_and_routes**
- L1: `import { Link } from 'react-router-dom';`

### `src/components/PromoBanner.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/ProtectedRoute.jsx`
**api_and_routes**
- L2: `import { Outlet } from 'react-router-dom';`

### `src/components/ScrollToTop.jsx`
**api_and_routes**
- L2: `import { useLocation, useNavigationType } from "react-router-dom";`

### `src/components/Seo.jsx`
**api_and_routes**
- L2: `import { useLocation } from 'react-router-dom';`
- L67: `// trail so every crawlable route carries a BreadcrumbList.`

### `src/components/SiteLoader.jsx`
**api_and_routes**
- L7: `// late-rendering route content whose images mount a moment after first paint.`

### `src/components/SupportChat.jsx`
**api_and_routes**
- L8: `* with keyword matching. No external API, no paid AI service and no network`

### `src/components/admin/AdminErrorBoundary.jsx`
**admin_and_content_management**
- L12: `console.error('Admin crash', err, info);`

### `src/components/admin/EntityCrud.jsx`
**admin_and_content_management**
- L3: `import RichTextEditor from '@/components/admin/RichTextEditor';`
- L4: `import { UploadCloud, Trash2, Pencil, X, Plus, Loader2, Save } from 'lucide-react';`
- L7: `* Reusable entity CRUD table + form for the admin panel.`
- L131: `className="admin-input sm:w-64"`
- L150: `<table className="admin-table">`
- L304: `return <ImageUploadField field={field} value={value} onChange={onChange} />;`
- L309: `<label className="admin-label" htmlFor={field.key}>{field.label}{field.required ? ' *' : ''}</label>`
- L315: `return <GalleryUploadField field={field} value={value} onChange={onChange} />;`
**api_and_routes**
- L2: `import { base44 } from '@/api/base44Client';`
**database_and_models**
- L7: `* Reusable entity CRUD table + form for the admin panel.`

### `src/components/admin/RichTextEditor.jsx`
**admin_and_content_management**
- L7: `<div dir="rtl" className="admin-richtext-editor rounded-xl overflow-hidden">`

### `src/components/admin/SiteModeToggle.jsx`
**api_and_routes**
- L4: `import { base44 } from '@/api/base44Client';`

### `src/components/content/RichArticleContent.jsx`
**admin_and_content_management**
- L18: `// Some CMS records contain escaped tags (\<p>, &lt;p&gt;, or &amp;lt;p&amp;gt;) rather than real markup.`
**test_and_ci**
- L23: `if (ENCODED_HTML_TAG.test(source)) {`
- L45: `const block = /^(p|div|section|article|h[1-6]|ul|ol|li|blockquote|pre|tr)$/.test(tag);`
- L120: `return /(?:^|\s)#{1,6}\s+/u.test(text)`
- L121: `|| /\*\*[^*\n]+\*\*/u.test(text)`
- L122: `|| /(?:^|\s)-\s+\*\*/u.test(text);`
- L127: `if (!raw || /[\u0000-\u001f]/u.test(raw)) return false;`
- L174: `if (typeof DOMParser !== 'undefined' && HTML_TAG.test(source)) {`

### `src/components/home/HomeAwardsSlider.jsx`
**api_and_routes**
- L2: `import { getAwards } from '@/lib/api/content';`

### `src/components/home/HomeClients.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/home/HomeContactForm.jsx`
**api_and_routes**
- L6: `import { createContactMessage } from '@/lib/api/content';`

### `src/components/home/HomeMagazine.jsx`
**admin_and_content_management**
- L26: `<StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگز`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L6: `import { getBlogPosts } from '@/lib/api/content';`

### `src/components/home/HomeNews.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L6: `import { getNewsPosts } from '@/lib/api/content';`

### `src/components/home/HomeOrigin.jsx`
**api_and_routes**
- L1: `import { Link } from 'react-router-dom';`

### `src/components/home/HomeVideoShowcase.jsx`
**admin_and_content_management**
- L97: `// Show a deliberately small five-item selection on the homepage; the admin ordering decides which items lead.`
**test_and_ci**
- L44: `{nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}`

### `src/components/story/StickyScene.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`

### `src/components/story/VitrineScroll.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
**database_and_models**
- L20: `* vertical scroll drives a horizontal slide of large product panels.`

### `src/components/ui/alert-dialog.jsx`
**database_and_models**
- L30: `"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out dat`

### `src/components/ui/carousel.jsx`
**slide_content_and_frontend**
- L2: `import useEmblaCarousel from "embla-carousel-react";`
- L8: `const CarouselContext = React.createContext(null)`
- L10: `function useCarousel() {`
- L11: `const context = React.useContext(CarouselContext)`
- L14: `throw new Error("useCarousel must be used within a <Carousel />")`
- L20: `const Carousel = React.forwardRef((`
- L32: `const [carouselRef, api] = useEmblaCarousel({`
- L89: `(<CarouselContext.Provider`
**api_and_routes**
- L32: `const [carouselRef, api] = useEmblaCarousel({`
- L39: `const onSelect = React.useCallback((api) => {`
- L40: `if (!api) {`
- L44: `setCanScrollPrev(api.canScrollPrev())`
- L45: `setCanScrollNext(api.canScrollNext())`
- L49: `api?.scrollPrev()`
- L50: `}, [api])`
- L53: `api?.scrollNext()`
**database_and_models**
- L140: `aria-roledescription="slide"`
- L166: `<span className="sr-only">Previous slide</span>`
- L187: `<span className="sr-only">Next slide</span>`

### `src/components/ui/context-menu.jsx`
**database_and_models**
- L38: `"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open`
- L50: `"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open`

### `src/components/ui/dialog.jsx`
**database_and_models**
- L34: `"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out dat`

### `src/components/ui/dropdown-menu.jsx`
**database_and_models**
- L39: `"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open`
- L54: `"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-`

### `src/components/ui/eyebrow.jsx`
**test_and_ci**
- L14: `return \`eyebrow${ARABIC_SCRIPT.test(textOf(children)) ? ' eyebrow-fa' : ''}${extra ? \` ${extra}\` : ''}\`;`

### `src/components/ui/hover-card.jsx`
**database_and_models**
- L18: `"z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`

### `src/components/ui/menubar.jsx`
**database_and_models**
- L80: `"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open`
- L98: `"z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]`

### `src/components/ui/navigation-menu.jsx`
**database_and_models**
- L56: `"left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start`

### `src/components/ui/popover.jsx`
**database_and_models**
- L19: `"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`

### `src/components/ui/select.jsx`
**database_and_models**
- L57: `"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 da`

### `src/components/ui/sheet.jsx`
**database_and_models**
- L33: `top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",`
- L35: `"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",`
- L36: `left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",`
- L38: `"inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",`

### `src/components/ui/slider.jsx`
**database_and_models**
- L2: `import * as SliderPrimitive from "@radix-ui/react-slider"`
- L6: `const Slider = React.forwardRef(({ className, ...props }, ref) => (`
- L19: `Slider.displayName = SliderPrimitive.Root.displayName`
- L21: `export { Slider }`

### `src/components/ui/toast.jsx`
**database_and_models**
- L22: `"group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:tran`

### `src/components/ui/tooltip.jsx`
**database_and_models**
- L20: `"z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-ou`

### `src/content.js`
**api_and_routes**
- L2: `* 7Golden content API — talks to local backend (/api/*) via Vite proxy.`
- L6: `const API = '/api';`
- L9: `const res = await fetch(\`${API}${path}\`);`
- L18: `const res = await fetch(\`${API}${path}\`, {`
- L203: `const res = await fetch(\`${API}/orders\`, {`

### `src/index.css`
**admin_and_content_management**
- L839: `/* ===== ADMIN PANEL ===== */`
- L840: `.admin-table {`
- L844: `.admin-table th {`
- L854: `.admin-table td {`
- L860: `.admin-table tr:hover td {`
- L863: `.admin-input {`
- L874: `.admin-input:focus {`
- L878: `.admin-label {`

### `src/lib/AppContext.jsx`
**admin_and_content_management**
- L53: `// Kept as a no-op so existing callers (admin toggle, pull-to-refresh) still work.`
**api_and_routes**
- L2: `// import { getSiteSettings } from '@/lib/api/content';`

### `src/lib/AuthContext.jsx`
**api_and_routes**
- L6: `async function api(path, options = {}) {`
- L8: `const controller = new AbortController();`
- L12: `const res = await fetch(\`/api${path}\`, {`
- L52: `const settingsController = new AbortController();`
- L55: `const response = await fetch('/api/settings', { signal: settingsController.signal });`
- L85: `const currentUser = await api('/auth/me');`
- L99: `const data = await api('/auth/login', {`
- L110: `const data = await api('/auth/register', {`

### `src/lib/PageNotFound.jsx`
**admin_and_content_management**
- L42: `{/* Admin Note */}`
- L43: `{isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (`
- L50: `<p className="text-sm font-medium text-slate-700">Admin Note</p>`
**api_and_routes**
- L1: `import { useLocation } from 'react-router-dom';`
- L2: `import { base44 } from '@/api/base44Client';`

### `src/lib/api/content.js`
**api_and_routes**
- L2: `* 7Golden content API — talks to local backend (/api/*) via Vite proxy.`
- L6: `const API = '/api';`
- L9: `const res = await fetch(\`${API}${path}\`);`
- L18: `const res = await fetch(\`${API}${path}\`, {`
- L311: `const res = await fetch(\`${API}/orders\`, {`
**test_and_ci**
- L86: `if (/&lt;\/?(?:p|div|h[1-6]|ul|ol|li|strong|br)\b/i.test(source)) {`

### `src/lib/corporate-content.js`
**admin_and_content_management**
- L11: `// the Base44 entities so images and links stay in sync with the CMS.`

### `src/lib/editorial-blog-content.js`
**slide_content_and_frontend**
- L54: `image: '/banner/hazelnut-spoon.webp',`
**admin_and_content_management**
- L2: `// These posts supplement, but never replace, CMS-managed posts.`

### `src/lib/home-media.js`
**slide_content_and_frontend**
- L38: `{ id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L41: `{ id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L44: `{ id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`
- L45: `{ id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },`

### `src/lib/news-content.js`
**slide_content_and_frontend**
- L205: `image: '/banner/hazelnut-spoon.webp',`

### `src/lib/seo.js`
**api_and_routes**
- L115: `// Human labels for the crawlable static routes. Dynamic routes (product /`
- L126: `// the SERP. Returns null for the home page or any route without a known label.`
**database_and_models**
- L4: `// loaded from the SiteSettings entity.`

### `src/lib/usePageHero.js`
**api_and_routes**
- L2: `import { getPageHero } from '@/lib/api/content';`
- L5: `* Fetches the hero section config for a page from the API.`

### `src/pages/About.jsx`
**slide_content_and_frontend**
- L5: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L55: `<DynamicHeroSlider`

### `src/pages/Account.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L4: `import { base44 } from '@/api/base44Client';`
- L17: `import { getOrders } from '@/lib/api/content';`

### `src/pages/Admin.jsx`
**admin_and_content_management**
- L9: `import EntityCrud from '@/components/admin/EntityCrud';`
- L10: `import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';`
- L33: `export default function Admin() {`
- L52: `if (user?.role !== 'admin') {`
- L89: `{ value: 'admin', label: 'ادمین' },`
- L97: `<p className="text-xs" style={{ color: 'var(--fg-muted)' }}>فعلی seed: admin@7golden.co — حتماً عوض شود.</p>`
- L107: `<div className="admin-shell flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">`
- L108: `<aside className="admin-sidebar lg:w-64 flex-shrink-0 lg:h-screen lg:overflow-y-auto" style={{ background: 'hsl(var(--card))', borderLeft: '1px solid var(--border)' }}>`
**api_and_routes**
- L2: `import { Link, useNavigate } from 'react-router-dom';`
- L12: `import { base44 } from '@/api/base44Client';`
- L224: `const { base44 } = await import('@/api/base44Client');`
**migrations_and_seeders**
- L97: `<p className="text-xs" style={{ color: 'var(--fg-muted)' }}>فعلی seed: admin@7golden.co — حتماً عوض شود.</p>`

### `src/pages/Blog.jsx`
**slide_content_and_frontend**
- L7: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L148: `<DynamicHeroSlider pageKey="blog" fallback={{ image: hero?.image, title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />`
**admin_and_content_management**
- L131: `const filtered = posts; // Search and category filtering are applied across the complete CMS dataset by the API.`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L4: `import { getBlogMeta, getBlogPosts } from '@/lib/api/content';`
- L131: `const filtered = posts; // Search and category filtering are applied across the complete CMS dataset by the API.`

### `src/pages/BlogPost.jsx`
**admin_and_content_management**
- L45: `// Editorial content below remains available without the CMS.`
**api_and_routes**
- L2: `import { useParams, Link, useLocation } from 'react-router-dom';`
- L5: `import { getBlogPostBySlug, getBlogPosts } from '@/lib/api/content';`
**test_and_ci**
- L19: `return HTML_CONTENT_TAG.test(source)`
- L20: `|| /&(?:amp;)?lt;\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b/i.test(source)`
- L21: `|| /\\<\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b/i.test(source);`

### `src/pages/Checkout.jsx`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L16: `import { createOrder } from '@/lib/api/content';`

### `src/pages/Contact.jsx`
**slide_content_and_frontend**
- L5: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L71: `<DynamicHeroSlider pageKey="contact" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />`
- L304: `<img src="/hazelnut-spoon.webp" alt="" loading="lazy" decoding="async" />`
**api_and_routes**
- L13: `import { createContactMessage } from '@/lib/api/content';`

### `src/pages/ForgotPassword.jsx`
**api_and_routes**
- L2: `import { Link } from "react-router-dom";`
- L3: `import { base44 } from "@/api/base44Client";`

### `src/pages/Home.jsx`
**slide_content_and_frontend**
- L16: `import HeroSlider from '@/components/HeroSlider';`
- L277: `{sectionVisible('hero') && <HeroSlider cmsHero={heroConfig} />}`
**admin_and_content_management**
- L96: `// The local presentation remains available when CMS data is unavailable.`
**api_and_routes**
- L8: `} from '@/lib/api/content';`

### `src/pages/Login.jsx`
**api_and_routes**
- L2: `import { Link } from "react-router-dom";`

### `src/pages/News.jsx`
**slide_content_and_frontend**
- L4: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L183: `<DynamicHeroSlider`
**admin_and_content_management**
- L143: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
**api_and_routes**
- L2: `import { Link } from 'react-router-dom';`
- L12: `import { getNewsMeta, getNewsPosts } from '@/lib/api/content';`
- L143: `// has run; once the NewsPost API has records, the CMS is the public source of truth.`
**migrations_and_seeders**
- L142: `// Preserve the seven existing editorial news items until the first database seed`

### `src/pages/NewsArticle.jsx`
**api_and_routes**
- L2: `import { Link, useParams } from 'react-router-dom';`
- L11: `import { getNewsPostBySlug } from '@/lib/api/content';`

### `src/pages/OAuthConsent.jsx`
**api_and_routes**
- L33: `// route for the signed-out redirect below. Send the session (cookie +`
- L40: `\`/api/apps/${appParams.appId}/mcp/consent-info?handle=${encodeURIComponent(ctx)}\`,`
- L90: `const res = await fetch(\`/api/apps/${appParams.appId}/mcp/authorize-grant\`, {`
**test_and_ci**
- L124: `if (!/^https?:/i.test(data.redirect_url)) {`

### `src/pages/ProductDetail.jsx`
**api_and_routes**
- L3: `import { useParams, Link } from 'react-router-dom';`
- L5: `import { getProductBySlug, getProducts } from '@/lib/api/content';`

### `src/pages/Register.jsx`
**api_and_routes**
- L2: `import { Link } from "react-router-dom";`

### `src/pages/ResetPassword.jsx`
**api_and_routes**
- L2: `import { Link, useSearchParams } from "react-router-dom";`
- L3: `import { base44 } from "@/api/base44Client";`

### `src/pages/Shop.jsx`
**slide_content_and_frontend**
- L7: `import DynamicHeroSlider from '@/components/DynamicHeroSlider';`
- L103: `<DynamicHeroSlider pageKey="shop" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />`
**api_and_routes**
- L2: `import { Link, useSearchParams } from 'react-router-dom';`
- L5: `import { getProducts, getCategories } from '@/lib/api/content';`
**migrations_and_seeders**
- L15: `// Category card art (kept in sync with the Category rows in the DB seed).`

### `src/styles/story.css`
**slide_content_and_frontend**
- L586: `.luxury-hero-slide-button {`
- L604: `.luxury-hero-slide-button img {`
- L613: `.luxury-hero-slide-button span {`
- L624: `.luxury-hero-slide-button b { color: var(--gold-2); font-size: .62rem; font-weight: 600; }`
- L625: `.luxury-hero-slide-button em { overflow: hidden; max-width: 8rem; color: rgba(255,255,255,.8); font-size: .65rem; font-style: normal; text-overflow: ellipsis; white-space: nowrap; }`
- L626: `.luxury-hero-slide-button:hover { border-color: rgba(218,185,103,.8); }`
- L627: `.luxury-hero-slide-button.is-active { width: min(12.5rem, calc(100vw - 3rem)); border-color: rgba(218,185,103,.85); background: rgba(11, 9, 5, .76); }`
- L628: `.luxury-hero-slide-button.is-active img { opacity: 1; }`
**admin_and_content_management**
- L4170: `/* ADMIN_RICHTEXT_UPLOAD_SCROLL_AND_BLOG_HTML_FIX_V1 */`
- L4171: `/* The desktop admin has its own dependable vertical scroll regions; mobile stays document-scrollable. */`
- L4173: `.admin-shell { height: 100vh; min-height: 0; overflow: hidden; }`
- L4174: `.admin-sidebar, .admin-main { min-height: 0; overscroll-behavior: contain; }`
- L4175: `.admin-sidebar { scrollbar-gutter: stable; }`
- L4176: `.admin-main { overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; }`
- L4178: `.admin-sidebar::-webkit-scrollbar, .admin-main::-webkit-scrollbar { width: 9px; }`
- L4179: `.admin-sidebar::-webkit-scrollbar-thumb, .admin-main::-webkit-scrollbar-thumb {`
**api_and_routes**
- L3457: `/* Never wrap page or card titles on these editorial routes. Excerpts and article`
**database_and_models**
- L516: `slider. All controls remain inside the safe area on narrow screens. */`
- L586: `.luxury-hero-slide-button {`
- L604: `.luxury-hero-slide-button img {`
- L613: `.luxury-hero-slide-button span {`
- L624: `.luxury-hero-slide-button b { color: var(--gold-2); font-size: .62rem; font-weight: 600; }`
- L625: `.luxury-hero-slide-button em { overflow: hidden; max-width: 8rem; color: rgba(255,255,255,.8); font-size: .65rem; font-style: normal; text-overflow: ellipsis; white-space: nowrap; }`
- L626: `.luxury-hero-slide-button:hover { border-color: rgba(218,185,103,.8); }`
- L627: `.luxury-hero-slide-button.is-active { width: min(12.5rem, calc(100vw - 3rem)); border-color: rgba(218,185,103,.85); background: rgba(11, 9, 5, .76); }`

### `vite.config.js`
**admin_and_content_management**
- L37: `'/uploads': {`
**api_and_routes**
- L23: `'react-vendor': ['react', 'react-dom', 'react-router-dom'],`
- L33: `'/api': {`


## Interpretation caveats

- Static scan only; no dependencies installed and no tests run.
- Keyword hits are leads, not proof of complete wiring.
- No source code changed; no database connection or secret-file read was attempted.
