# اجرای بک‌اند ۷گلدن

## Production / Docker (PostgreSQL)

```bash
# از ریشه ریپو
docker compose up --build
```

- فرانت: http://localhost:5173  
- بک: http://localhost:3001  
- Postgres: localhost:5432 (user/pass/db = `7golden`)

## لوکال بدون Docker (PostgreSQL)

1. Postgres را بالا بیاور (مثلاً با Docker):

```bash
docker run -d --name 7golden-pg \
  -e POSTGRES_USER=7golden \
  -e POSTGRES_PASSWORD=7golden \
  -e POSTGRES_DB=7golden \
  -p 5432:5432 postgres:16-alpine
```

2. بک‌اند:

```bash
cd backend
cp .env.example .env
# DATABASE_URL از قبل روی Postgres تنظیم شده
npm install
npm run db:setup
npm run dev
```

سرور: http://localhost:3001

## لوکال سریع با SQLite (فقط توسعه)

در `prisma/schema.prisma` موقتاً:

```prisma
provider = "sqlite"
```

و در `.env`:

```
DATABASE_URL="file:./dev.db"
```

سپس `npm run db:setup && npm run dev`.

> برای production همیشه PostgreSQL استفاده کنید.

## ادمین
- ایمیل: admin@7golden.co
- رمز: admin123

## APIهای اصلی
- GET /api/health
- GET /api/products | /api/products/:slug
- GET /api/categories | /api/blog | /api/blog/:slug
- GET /api/testimonials | /api/gallery | /api/awards
- POST /api/contact
- GET /api/settings
- POST /api/orders | GET /api/orders
- /api/entities/:Entity  (CRUD)
- POST /api/auth/login | register | GET /api/auth/me
- POST /api/upload (admin)
- GET /api/sitemap.xml
