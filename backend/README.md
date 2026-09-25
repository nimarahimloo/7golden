# 7Golden Backend

Standalone Express + Prisma API replacing Base44 for the 7Golden project.

## Quick start

```bash
cd backend
npm install
npm run db:setup   # generate + push schema + seed
npm run dev        # http://localhost:3001
```

## Admin

- Email: `admin@7golden.co`
- Password: `admin123`

## Main endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login → `{ access_token, user }` |
| GET | `/api/auth/me` | Bearer token |
| GET | `/api/products` | Public published products |
| GET | `/api/products/:slug` | By slug |
| GET | `/api/categories` | Categories |
| GET | `/api/blog` | Blog posts |
| GET | `/api/blog/:slug` | Post by slug |
| GET | `/api/testimonials` | Testimonials |
| GET | `/api/gallery` | Gallery |
| GET | `/api/awards` | Awards |
| POST | `/api/contact` | Contact form |
| GET | `/api/settings` | Site settings |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List (own or admin) |
| GET/POST/PUT/DELETE | `/api/entities/:Entity` | Generic CRUD (admin for writes) |
| POST | `/api/upload` | Admin file upload |
| GET | `/api/sitemap.xml` | Sitemap |

## Env

See `.env.example`. Default SQLite at `prisma/dev.db`. For production set `DATABASE_URL` to PostgreSQL.
