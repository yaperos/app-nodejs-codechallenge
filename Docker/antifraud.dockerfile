FROM node:18.15-alpine AS builder

ENV KAFKA_BROKER=${KAFKA_BROKER}

WORKDIR /app
COPY ./antifraud /app/antifraud
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn add @nestjs/cli -W
RUN yarn install & yarn build:frd


EXPOSE 3001

ENTRYPOINT [ "yarn", "start:prod:frd" ]