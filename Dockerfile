FROM node:16.16-alpine AS builder

WORKDIR /app

ARG APP_PATH
ARG APP_NAME

COPY *.json .
COPY ./libs ./libs
COPY ${APP_PATH} ./${APP_PATH}

RUN npm install --workspace=${APP_PATH} --include-workspace-root=true

RUN npm run build ${APP_NAME}

RUN npm prune --production

FROM node:16-alpine AS production

WORKDIR /app

ARG APP_PATH

ENV NODE_ENV production

COPY --from=builder /app/dist/$APP_PATH .
COPY --from=builder /app/node_modules ./node_modules

ENV APP_MAIN_FILE=${APP_PATH}/src/main

CMD node ${APP_MAIN_FILE}