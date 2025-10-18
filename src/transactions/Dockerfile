# Stage 1: install dependencies and build assets
FROM node:18.20-alpine AS builder

# Enable pnpm via corepack
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml tsconfig*.json ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
RUN pnpm prisma:generate

# Copy source and build
COPY . .
RUN pnpm run build
RUN pnpm run test

# Stage 2: runtime image
FROM node:18.20-alpine AS runtime

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000
CMD ["pnpm", "start"]
