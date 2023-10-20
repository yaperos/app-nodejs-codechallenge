# Prepare environment
FROM node:16-alpine as base
RUN apk add --update openssl
WORKDIR /app

FROM base AS build
COPY . .
RUN npm ci
RUN npm run build

FROM base
COPY package*.json yarn.* ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/.npmrc .npmrc
RUN npm install --production
CMD npm start
CMD ["sh", "-c", "npm start 2>&1"]
