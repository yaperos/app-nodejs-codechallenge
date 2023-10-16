FROM node:18.15.0-alpine3.17 As development

LABEL "server"="Micro-server-yape"
LABEL maintainer="joseagraz29@gmail.com"
LABEL version="1.0"

RUN apk add nano

WORKDIR /app
COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn install
COPY . .
RUN yarn run build

EXPOSE 3000
CMD ["yarn", "start:dev"]
