FROM node:24.12-alpine AS build
WORKDIR /home/node/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci && npm cache clean --force
COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build

FROM node:24.12-alpine as production
WORKDIR /home/node/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node --from=build /home/node/app/dist ./dist
RUN npx prisma generate && cp -rv src/generated dist/src/
ENV NODE_ENV=production
EXPOSE 4000
USER node
CMD ["npm", "run", "start:prod"]