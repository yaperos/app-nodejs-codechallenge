FROM node:18.15.0-alpine3.17 As development

LABEL "server"="Server-yape"
LABEL maintainer="joseagraz29@gmail.com"
LABEL version="1.0"

RUN apk add nano
RUN apk add openssl

WORKDIR /app
COPY package.json yarn.lock /app/
WORKDIR /app/src/auths/certs/
RUN openssl genrsa -out jwt-private.key 2048 && openssl rsa -in jwt-private.key -pubout -out jwt-public.key
WORKDIR /app
RUN yarn install
COPY . .
RUN yarn run build

EXPOSE 4000
CMD ["yarn", "start:dev"]
