# Use a lightweight Node.js image
FROM node:18.12.0-buster

WORKDIR /challenge/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "consumer"]
