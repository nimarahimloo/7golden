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
- `docker-compose.base44.yml` runs the Vite dev server from the mounted source on host port 3000. The dev server proxies `/api` to the Base44 cloud backend; a 500 from the SDK app-state check is expected when only the frontend runs locally and does not break rendering.


