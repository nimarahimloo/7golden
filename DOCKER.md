# اجرای کامل با Docker

## یک دستور

```bash
docker compose up --build
```

- فرانت: http://localhost:5173  
- بک‌اند: http://localhost:3001  
- Health: http://localhost:3001/api/health  

## ادمین بک‌اند
- ایمیل: `admin@7golden.co`
- رمز: `admin123`

## بدون Docker (لوکال)

ترمینال ۱ — بک‌اند:
```bash
cd backend
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
- **فرانت (محتوای عمومی):** از Base44 جدا شده (`src/lib/api/content.js` → API محلی)
- **لاگین/ادمین پنل:** هنوز ممکن است SDK Base44 را صدا بزند؛ برای پنل ادمین کامل بعداً می‌توان Auth را هم به JWT محلی مهاجرت داد
