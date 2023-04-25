FROM node:18-alpine

ARG NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY apps/transaction-service/.env.production .env

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:transaction:prod" ]
