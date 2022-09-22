FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./


FROM base as production

ENV NODE_ENV=production

RUN npm install --only=production

COPY . .

RUN npm run build transaction

CMD ["node", "dist/apps/transaction/main"]


FROM base as development

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD ["npm", "run","start:dev","transaction"]