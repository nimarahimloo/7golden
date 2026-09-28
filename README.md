# 7Golden — Backend + Docker Stack

## بک‌اند کاملاً مستقل از Base44 است.

### Stack
- **Frontend:** React + Vite (proxy `/api` → backend)
- **Backend:** Node.js + Express + Prisma + JWT
- **Database:** PostgreSQL (production) / SQLite (local quickstart only)

### نصب و اجرا با Docker (پیشنهادی)

```bash
docker compose up --build
```

- فرانت: http://localhost:5173  
- بک: http://localhost:3001  
- Postgres: localhost:5432  

ادمین API: `admin@7golden.co` / `admin123`

جزئیات بیشتر: [DOCKER.md](DOCKER.md) و [backend/HOW_TO_RUN.md](backend/HOW_TO_RUN.md)

### بدون Docker

**1. Postgres**
```bash
docker run -d --name 7golden-pg \
  -e POSTGRES_USER=7golden \
  -e POSTGRES_PASSWORD=7golden \
  -e POSTGRES_DB=7golden \
  -p 5432:5432 postgres:16-alpine
```

**2. Backend**
```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

**3. Frontend**
```bash
# ریشه ریپو
npm install
npm run dev
```

### وابستگی Base44
- **بک‌اند:** صفر — کاملاً مستقل
- **فرانت:** `src/api/base44Client.js` فقط به API محلی (`/api/*`) وصل می‌شود. هیچ پکیج `@base44/*` باقی نمانده.

### Production notes
- `DATABASE_URL` را به Postgres واقعی ست کنید.
- `JWT_SECRET` را به یک مقدار تصادفی بلند تغییر دهید.
- `CORS_ORIGIN` را به دامنه واقعی محدود کنید.
- فایل‌های آپلود در `UPLOAD_DIR` (یا S3) ذخیره می‌شوند.
