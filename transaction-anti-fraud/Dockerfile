FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --network-timeout 100000

COPY . .

EXPOSE 4000

CMD ["yarn","start:dev"]