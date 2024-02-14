FROM node:18-alpine AS base

# Development stage
FROM base AS dev

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production stage
FROM base AS prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package*.json ./

RUN npm ci
RUN npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]