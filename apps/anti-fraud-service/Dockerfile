FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy service package files and shared library
COPY apps ./apps
COPY libs ./libs

# Install dependencies
RUN npm install

# Build the application
RUN npm run build -w apps/anti-fraud-service

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/anti-fraud-service/package*.json ./apps/anti-fraud-service/

# Copy built files and shared library
COPY --from=builder /app/apps/anti-fraud-service/dist/apps/anti-fraud-service/src ./apps/anti-fraud-service/dist
COPY --from=builder /app/apps/anti-fraud-service/dist/libs ./libs

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app

EXPOSE 3000

CMD ["node", "apps/anti-fraud-service/dist/main.js"]
