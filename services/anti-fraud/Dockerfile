FROM node:alpine

ARG KAFKA_BROKER

WORKDIR /usr/src/app

COPY ./my-org-common-tools-1.0.0.tgz .

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
