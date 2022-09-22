FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./


FROM base as production

ENV NODE_ENV=production

RUN npm install --only=production

COPY . .

RUN npm run build anti-fraud

CMD ["node", "dist/apps/anti-fraud/main"]


FROM base as development

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD ["npm", "run","start:dev","anti-fraud"]