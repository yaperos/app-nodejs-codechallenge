FROM node:16.1-alpine3.13

ARG BASE_DIR

WORKDIR /application

COPY ${BASE_DIR}/package.json .

RUN npm install

COPY ${BASE_DIR}/. .

RUN npm run build

CMD ["npm", "run", "start"]

