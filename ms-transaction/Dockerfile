FROM node:21-alpine3.18 AS base

WORKDIR /usr/src/app

FROM base AS development

ENV NODE_ENV=development

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

