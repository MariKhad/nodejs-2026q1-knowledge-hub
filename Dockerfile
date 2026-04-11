# ========== BUILD ==========
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ========== PRODUCTION ==========
FROM node:24-alpine
WORKDIR /app
RUN apk add --no-cache curl

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

RUN npm install ts-node @types/node --omit=dev

COPY --from=builder /app/prisma/migrations ./prisma/migrations

COPY --from=builder /app/prisma/seed.ts ./prisma/ 2>/dev/null || true

RUN npx prisma generate

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

CMD npx prisma migrate deploy && \
    npx prisma db seed && \
    node dist/main