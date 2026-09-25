FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

RUN npx prisma generate
RUN mkdir -p /app/data /app/uploads

ENV DATABASE_URL="file:/app/data/dev.db"
ENV JWT_SECRET="7golden-docker-secret-change-me"
ENV PORT=3001
ENV CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
ENV UPLOAD_DIR="/app/uploads"
ENV PUBLIC_URL="http://localhost:3001"

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && npx tsx prisma/seed.ts; npx tsx src/index.ts"]
