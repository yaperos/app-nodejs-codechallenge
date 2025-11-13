# ---------- build ----------
FROM node:20-bullseye-slim AS build
WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY transaction-service/package.json ./package.json
COPY transaction-service/package-lock.json ./package-lock.json
RUN npm ci

COPY transaction-service/ ./
COPY contracts ./contracts
RUN mkdir -p /usr/src/contracts && cp -r ./contracts/. /usr/src/contracts
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/yape
RUN npx prisma generate
RUN npm run build

# ---------- runtime ----------
FROM node:20-bullseye-slim AS runtime
WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/yape

COPY transaction-service/package.json ./package.json
COPY transaction-service/package-lock.json ./package-lock.json
RUN npm ci --omit=dev

COPY transaction-service/prisma ./prisma
RUN npx prisma generate

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/contracts ./contracts
RUN mkdir -p /usr/src/contracts && cp -r ./contracts/. /usr/src/contracts
COPY --from=build /usr/src/app/scripts ./scripts
# bring generated prisma client
COPY --from=build /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN chmod +x ./scripts/start.sh
EXPOSE 3000
CMD ["sh", "./scripts/start.sh"]
