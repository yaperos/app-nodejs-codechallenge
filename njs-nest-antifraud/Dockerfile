FROM node:16-alpine

RUN apk upgrade libssl3 libcrypto3

WORKDIR /app

COPY dist/ /app/dist
COPY package.json .
COPY node_modules/ /app/node_modules

RUN chown -R daemon /app/dist/

USER daemon

RUN mkdir -p /app/dist/logs

WORKDIR /app/dist

CMD ["yarn", "start:prod"]
