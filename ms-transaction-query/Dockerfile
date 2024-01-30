FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ./ms-transaction-query/package*.json ./

RUN npm install --only=production

COPY ./ms-transaction-query/src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
