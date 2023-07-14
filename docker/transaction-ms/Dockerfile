FROM node:18-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ENV APP_HOME /usr/src/app

USER node

WORKDIR $APP_HOME

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN yarn install

FROM node:18-alpine as development

ARG PORT=80
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
ENV APP_HOME /usr/src/app
ENV PORT $PORT

USER node

WORKDIR $APP_HOME

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node package.json .
COPY --chown=node:node tsconfig*.json .
COPY --chown=node:node nest-cli.json .
COPY --chown=node:node ./apps/ ./apps
COPY --chown=node:node ./docker/transaction-ms/docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE $PORT
