FROM node:18-alpine3.16

WORKDIR /app

COPY package*.json ./
COPY apps/transaction-service/prisma ./apps/transaction-service/prisma/

COPY apps/transaction-service/.env.production ./apps/transaction-service/.env

RUN npm install

COPY . .

RUN npx prisma generate --schema=./apps/transaction-service/prisma/schema.prisma

RUN npm run build transaction-service

CMD [ "npm", "run", "start:transaction:migrate:prod" ]
