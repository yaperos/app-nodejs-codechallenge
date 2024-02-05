FROM node:20-alpine as base

WORKDIR /app

COPY package*.json ./


FROM base as production

ENV NODE_ENV=production

RUN npm i --only=production

COPY . .

RUN npm run build transaction-ms

CMD ["node", "dist/apps/transaction-ms/main"]


FROM base as development

ENV NODE_ENV=development

RUN npm i

COPY . .

CMD ["npm", "run","start:dev","transaction-ms"]