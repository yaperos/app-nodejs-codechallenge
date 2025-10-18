# Stage 1: install dependencies and build assets
FROM node:18.20-alpine AS builder

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

COPY package.json tsconfig*.json ./
COPY pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: runtime image
FROM node:18.20-alpine AS runtime

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

COPY --from=builder /app /app

CMD ["pnpm", "start"]
