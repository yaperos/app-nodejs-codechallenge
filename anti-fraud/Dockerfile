# First Stage
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build \
    && npm prune --production

# Second Stage
FROM node:18
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json /usr/src/app/
COPY --from=builder /usr/src/app/node_modules/ /usr/src/app/node_modules/
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/
CMD ["node", "dist/main"]
