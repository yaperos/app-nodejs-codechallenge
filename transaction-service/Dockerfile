FROM node:16-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./.env

RUN npm install
RUN npx prisma generate
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]