FROM node:alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN npm install yarn
RUN yarn install

COPY . .

RUN yarn run build
