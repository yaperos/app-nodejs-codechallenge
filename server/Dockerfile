# Base image
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --silent
RUN npm i -g typeorm ts-node
# Bundle app source
COPY . .