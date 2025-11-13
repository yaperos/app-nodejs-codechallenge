# ---------- base ----------
FROM node:20-bullseye-slim AS base
WORKDIR /usr/src/app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# ---------- deps (dev) ----------
FROM base AS deps
COPY anti-fraud-service/package.json ./package.json
COPY anti-fraud-service/package-lock.json ./package-lock.json
RUN npm ci

# ---------- build ----------
FROM deps AS build
COPY anti-fraud-service/ ./
COPY contracts ./contracts
RUN mkdir -p /usr/src/contracts && cp -r ./contracts/. /usr/src/contracts
RUN npm run build

# ---------- prod-deps (clean prod install) ----------
FROM base AS prod-deps
COPY anti-fraud-service/package.json ./package.json
COPY anti-fraud-service/package-lock.json ./package-lock.json
RUN npm ci --omit=dev

# ---------- runtime ----------
FROM base AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production
# only production node_modules
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
# compiled app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/contracts ./contracts
RUN mkdir -p /usr/src/contracts && cp -r ./contracts/. /usr/src/contracts
EXPOSE 3001
CMD ["node", "dist/main.js"]
