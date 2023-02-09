FROM node:16

WORKDIR /usr/dev/transactions

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4000
CMD ["npm", "run", "start:dev"]