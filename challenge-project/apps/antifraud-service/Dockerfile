FROM node:18-alpine

ARG NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY apps/antifraud-service/.env.production dist/apps/antifraud-service/.env

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:antifraud:prod" ]
