ARG app_port

FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
COPY ./docker.env ./.env

RUN npm run build

EXPOSE $app_port

CMD [ "npm", "start" ]