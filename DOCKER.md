# Run with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health: http://localhost:3001/api/health

Admin: admin@7golden.co / admin123

Without Docker:
```bash
cd backend && npm install && npm run db:setup && npm run dev
# other terminal
npm install && npm run dev
```
