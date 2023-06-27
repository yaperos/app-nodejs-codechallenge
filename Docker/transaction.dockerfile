FROM node:18.15-alpine AS builder

ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG KAFKA_BROKER

ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV KAFKA_BROKER=${KAFKA_BROKER}

WORKDIR /app
COPY ./transactions /app/transactions
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn add @nestjs/cli -W
RUN yarn install & yarn build:trx


EXPOSE 3000

ENTRYPOINT [ "yarn", "start:prod:trx" ]
