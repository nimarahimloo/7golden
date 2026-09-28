# اجرای کامل با Docker

## یک دستور

```bash
docker compose up --build
```

- فرانت: http://localhost:5173  
- بک‌اند: http://localhost:3001  
- Postgres: localhost:5432 (user/pass/db = `7golden`)
- Health: http://localhost:3001/api/health  

## ادمین بک‌اند
- ایمیل: `admin@7golden.co`
- رمز: `admin123`

## بدون Docker (لوکال + PostgreSQL)

ترمینال ۰ — Postgres:
```bash
docker run -d --name 7golden-pg \
  -e POSTGRES_USER=7golden \
  -e POSTGRES_PASSWORD=7golden \
  -e POSTGRES_DB=7golden \
  -p 5432:5432 postgres:16-alpine
```

ترمینال ۱ — بک‌اند:
```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

ترمینال ۲ — فرانت:
```bash
npm install
npm run dev
```

Vite درخواست‌های `/api` را به `localhost:3001` پروکسی می‌کند.

## وابستگی Base44
- **بک‌اند:** صفر — کاملاً مستقل
- **فرانت:** `src/api/base44Client.js` فقط به API محلی متصل است. هیچ پکیج `@base44/*` در پروژه باقی نمانده.
