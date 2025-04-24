FROM node:20-alpine3.20 AS builder
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine3.20 AS runner
RUN npm install -g pnpm
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/main" ]
