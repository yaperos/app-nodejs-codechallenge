FROM node:18.18-alpine AS builder

WORKDIR /app

# Copy Dependecies files
COPY package.json ./

# Install dependecies
RUN yarn install

# Bundle backend source
COPY . .

ENV NODE_ENV=production

#RUN yarn build
RUN yarn build && \
    npm run typeorm:generate-migrations && \
    npm run typeorm:run-migrations

FROM node:18.18-alpine
WORKDIR /app

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy commands file
COPY --from=builder /app/package.json .

# Copy bundle backend files
COPY --from=builder /app/dist ./dist

CMD yarn start:prod
