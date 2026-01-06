FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/anti-fraud-service ./apps/anti-fraud-service
COPY libs ./libs

# Build application
RUN npm run build:anti-fraud

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder (maintain directory structure)
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/apps/anti-fraud-service/apps/anti-fraud-service/src/main.js"]
