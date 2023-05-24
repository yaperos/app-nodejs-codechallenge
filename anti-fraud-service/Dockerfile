FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build


FROM node:16-alpine AS final

WORKDIR /app

ARG KAFKA_HOST_URL
ENV KAFKA_HOST_URL=$KAFKA_HOST_URL

COPY --from=builder ./app/dist ./dist

COPY package.json .

COPY yarn.lock .

RUN yarn install --production

CMD [ "yarn", "start" ]