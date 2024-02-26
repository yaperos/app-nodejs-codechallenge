FROM node:alpine

ARG KAFKA_BROKER

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY ./my-org-common-tools-1.0.0.tgz .

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]