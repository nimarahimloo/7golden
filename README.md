# 7Golden — Backend + Docker Stack

## بک‌اند کاملاً مستقل از Base44 است.

### نصب روی ریپوی فعلی

1. پوشه `backend/` را از این پکیج کپی کن داخل ریشه ریپو (جایگزین backend قبلی).
2. فایل‌های زیر را کپی کن:
   - `docker-compose.yml` → ریشه ریپو
   - `Dockerfile.frontend` → ریشه ریپو
   - `vite.config.js` → ریشه ریپو (جایگزین)
   - `content.js` → `src/lib/api/content.js` (جایگزین)
3. اجرا:

```bash
docker compose up --build
```

فرانت: http://localhost:5173  
بک: http://localhost:3001  

ادمین API: admin@7golden.co / admin123

جزئیات بیشتر: DOCKER.md
