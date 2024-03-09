FROM node:18

WORKDIR /usr/src/transaction

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]