# اعمال روی ریپوی 7Golden

## مشکل فعلی ECONNREFUSED 3001
بک‌اند روشن نیست. در یک ترمینال جدا:

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

سپس در ریشه:
```bash
echo 'VITE_BASE44_APP_BASE_URL=http://localhost:3001' > .env.local
npm run dev
```

## کپی فایل‌ها
از این پکیج:

```bash
# بک‌اند
cp -r backend/* /path/to/7Golden/backend/

# فرانت
cp vite.config.js /path/to/7Golden/
cp src/lib/api/content.js /path/to/7Golden/src/lib/api/
cp src/lib/products.js /path/to/7Golden/src/lib/
cp src/components/TrustBadges.jsx OriginStory.jsx BusinessCTA.jsx → components/
cp src/components/ui/image-helpers.js image.jsx → components/ui/

# تصاویر لوکال
mkdir -p public/cdn public/certificates
cp -r public_cdn/* public/cdn/
cp -r public_certificates/* public/certificates/
```

همه URLهای media.base44 و 7golden.co/wp-content از کد حذف شده‌اند.
