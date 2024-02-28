FROM node:20-alpine

RUN yarn install

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD [ "yarn", "start" ]