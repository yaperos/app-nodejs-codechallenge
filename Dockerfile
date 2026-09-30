# Una sola imagen parametrizada por APP (transaction | anti-fraud).
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG APP
RUN npx nest build ${APP} && npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app
ARG APP
ENV NODE_ENV=production APP=${APP}
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/apps/${APP} ./dist
USER node
CMD ["node", "dist/main.js"]
