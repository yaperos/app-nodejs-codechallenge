FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/transaction-service ./apps/transaction-service
COPY apps/anti-fraud-service ./apps/anti-fraud-service
COPY libs ./libs
COPY config/database/drizzle.config.ts ./config/database/
COPY drizzle ./drizzle

# Build application
RUN npm run build:transaction

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder (maintain directory structure)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config/database/drizzle.config.ts ./config/database/

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/apps/transaction-service/apps/transaction-service/src/main.js"]
