FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

# Copy service package files and shared library
COPY apps ./apps
COPY libs ./libs

# Install dependencies
RUN npm install

# Generate Prisma client and build
RUN cd apps/transaction-service && npx prisma generate
RUN npm run build -w apps/transaction-service

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./
COPY apps/transaction-service/package*.json ./apps/transaction-service/

# Copy built files, prisma and shared library
COPY --from=builder /app/apps/transaction-service/dist/apps/transaction-service/src ./apps/transaction-service/dist
COPY --from=builder /app/apps/transaction-service/dist/libs ./libs
COPY --from=builder /app/apps/transaction-service/prisma ./apps/transaction-service/prisma

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app

EXPOSE 3000

CMD ["node", "apps/transaction-service/dist/main.js"]
