# ========== BUILD ==========
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ========== PRODUCTION ==========
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 4000
CMD ["node", "dist/main"]