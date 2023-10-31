FROM node:20-alpine AS base
RUN apk add --no-cache \
    libc6-compat \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python3
RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
RUN apk update
RUN yarn global add pnpm turbo


# Builder
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=transaction-service


# PROD IMAGE
FROM base AS prod
WORKDIR /app
COPY --from=builder /app/out/ .
RUN pnpm install
RUN turbo build --filter=transaction-service...
RUN pnpm install --production -f


CMD ["node", "apps/transaction-service/dist/index.js"]