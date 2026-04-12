# ========== BUILD ==========
FROM node:24-alpine AS builder
WORKDIR /app

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ========== PRODUCTION ==========
FROM node:24-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl openssl

ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/prisma.config.ts ./


COPY --from=builder /app/prisma/migrations ./prisma/migrations

USER node

EXPOSE 4000

CMD npx prisma migrate deploy && node dist/src/main