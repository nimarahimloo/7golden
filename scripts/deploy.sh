#!/usr/bin/env bash
# 7Golden production deploy — run from /var/www/7golden as root
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> [1/6] git pull"
git pull --ff-only

echo "==> [2/6] frontend deps"
npm install --prefer-offline

echo "==> [3/6] frontend build"
npm run build

echo "==> [4/6] backend deps + db"
cd "$ROOT/backend"
npm install --prefer-offline
npm run db:setup

echo "==> [5/6] restart backend"
pm2 restart all --update-env || pm2 restart all

echo "==> [6/6] reload nginx"
systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null || true

echo ""
echo "✓ Deploy complete."
echo "  Frontend: $ROOT/dist"
echo "  Backend:  pm2 list"
