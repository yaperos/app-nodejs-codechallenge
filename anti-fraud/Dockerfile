FROM node:16-alpine

WORKDIR /usr/dev/anti-fraud

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "run", "start:dev"]