# FROM node:18-alpine3.16 as development
FROM node:18-alpine3.16 as development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:18-alpine3.16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/antifraud-service

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY . .

COPY --from=development /usr/src/antifraud-service/dist ./dist

CMD ["node", "dist/antifraud-service/main"]