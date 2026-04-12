FROM node:24-alpine AS build

WORKDIR /app

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

COPY --chown=node:node src/generated ./dist/src/generated


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/doc ./doc

USER node

EXPOSE 4000

CMD ["node", "dist/src/main.js"]