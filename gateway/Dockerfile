FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./gateway/package*.json ./

RUN npm install

RUN rm -rf /usr/src/app/node_modules/@yape-challenge/kafka/
COPY ./common/YapeKafkaCore/src /usr/src/app/node_modules/@yape-challenge/kafka/src
COPY ./common/YapeKafkaCore/package.json /usr/src/app/node_modules/@yape-challenge/kafka/
COPY ./common/YapeKafkaCore/tsconfig.cjs.json /usr/src/app/node_modules/@yape-challenge/kafka/
COPY ./common/YapeKafkaCore/tsconfig.esm.json /usr/src/app/node_modules/@yape-challenge/kafka/
COPY ./common/YapeKafkaCore/tsconfig.json /usr/src/app/node_modules/@yape-challenge/kafka/
WORKDIR /usr/src/app/node_modules/@yape-challenge/kafka/
RUN npm install
RUN npm run build
RUN rm -rf ./src

RUN rm -rf /usr/src/app/node_modules/@yape-challenge/broker-service/
COPY ./common/BrokerService/src /usr/src/app/node_modules/@yape-challenge/broker-service/src
COPY ./common/BrokerService/package.json /usr/src/app/node_modules/@yape-challenge/broker-service/
COPY ./common/BrokerService/tsconfig.cjs.json /usr/src/app/node_modules/@yape-challenge/broker-service/
COPY ./common/BrokerService/tsconfig.esm.json /usr/src/app/node_modules/@yape-challenge/broker-service/
COPY ./common/BrokerService/tsconfig.json /usr/src/app/node_modules/@yape-challenge/broker-service/
WORKDIR /usr/src/app/node_modules/@yape-challenge/broker-service/
RUN npm install
RUN npm run build
RUN rm -rf ./src

WORKDIR /usr/src/app

COPY ./gateway/src ./src
COPY ./gateway/docs ./docs

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]
