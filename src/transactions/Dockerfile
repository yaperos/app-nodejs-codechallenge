# Stage 1: install dependencies and build assets
FROM node:18.20-alpine AS builder

# Enable pnpm via corepack
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Install dependencies
COPY package.json tsconfig*.json ./
COPY pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --no-frozen-lockfile
RUN pnpm run prisma:generate

# Copy source and build
COPY . .
RUN pnpm run build

# Stage 2: runtime image
FROM node:18.20-alpine AS runtime

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

COPY --from=builder /app /app
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
