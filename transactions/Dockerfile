FROM node:18.15.0-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5000

CMD [ "yarn", "start:prod" ]
