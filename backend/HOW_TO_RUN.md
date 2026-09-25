# اجرای بک‌اند ۷گلدن

```bash
cd 7golden-backend
npm install
npm run db:setup
npm run dev
```

سرور: http://localhost:3001

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
- /api/entities/:Entity  (CRUD مطابق Base44)
- POST /api/auth/login | register | GET /api/auth/me
- POST /api/upload (admin)
- GET /api/sitemap.xml
