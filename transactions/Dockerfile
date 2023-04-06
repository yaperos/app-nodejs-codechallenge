FROM node:16-alpine

WORKDIR /usr/dev/transactions

COPY package*.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]