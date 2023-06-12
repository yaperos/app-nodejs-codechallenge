FROM node:14.21.3-alpine AS dev
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . .

FROM node:14.21.3-alpine AS build
WORKDIR /app
COPY package*.json /app
COPY --from=dev /app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force

FROM node:14.21.3-alpine AS run
COPY --from=build app/node_modules ./node_modules
COPY --from=build app/dist ./dist
COPY .env .env
EXPOSE 3001
CMD [ "node", "dist/main.js" ]
