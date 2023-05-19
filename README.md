# DOCKER COMPOSE YAPE CHALLENGE CODE

For the development of the challenge we use the following technologies:
- Javascript(NestJs)
- Kafka
- MongoDB
- Stevedore

Back-end development:
- Api-Transactions:
https://github.com/IngenieroCesar/api-transactions
It is an event driven/API developed on nestjs with hex modular architecture.
- Api-AntiFraud:
https://github.com/IngenieroCesar/api-antifraud
It is an event driven application developed on nestjs with hexagonal modular architecture.

Database:
The MongoDB non-relational database is implemented, where the use of indexes is implemented with an estimated volume of transactions of 500 requests per second.

Kafka:
A broker is implemented to apply an event-based architecture.

Docker:
Backend apps are containerized and deployed to the GitHub registry:
- Api-AntiFraud: ghcr.io/engineerocesar/api-antifraud:v0.0.1
- Api-Transactions: ghcr.io/engineerocesar/api-transactions:v0.0.1


```yaml
version: "3.7"
services:
  # kafka
  zookeeper:
    image: confluentinc/cp-zookeeper:7.3.2
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  broker:
    image: confluentinc/cp-kafka:7.3.2
    container_name: broker
    ports:
      - "9092:9092"
    expose:
      - '29092'
      - '9092'
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
  
  init-kafka:
    image: confluentinc/cp-kafka:7.3.2
    depends_on:
      - broker
    entrypoint: [ '/bin/sh', '-c' ]
    command: |
      "
      # blocks until kafka is reachable
      kafka-topics --bootstrap-server broker:29092 --list

      echo -e 'Creating kafka topics'
      kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic sendTransactionCreated --replication-factor 1 --partitions 1
      kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic sendTransactionStatusApproved --replication-factor 1 --partitions 1
      kafka-topics --bootstrap-server broker:29092 --create --if-not-exists --topic sendTransactionStatusRejected --replication-factor 1 --partitions 1

      echo -e 'Successfully created the following topics:'
      kafka-topics --bootstrap-server broker:29092 --list
      "
      
  #apitransaction
  mongo:
    image: mongo
    environment:
      MONGO_INITDB_DATABASE: yapechallenge
      MONGO_INITDB_ROOT_USERNAME: mongoadmin
      MONGO_INITDB_ROOT_PASSWORD: secret
    ports:
      - "27017:27017"
    expose:
      - '27017'
    volumes:
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
  #apitransaction
  apitransaction:
    image: ghcr.io/ingenierocesar/api-transactions:v0.0.1
    depends_on:
      - broker
      - mongo
    container_name: apitransaction
    restart: unless-stopped
    ports:
      - "9000:9000"
  #apiantifraud
  apiantifraud:
    image: ghcr.io/ingenierocesar/api-antifraud:v0.0.1
    depends_on:
      - broker
      - mongo
    container_name: apiantifraud
    restart: unless-stopped
    ports:
      - "9001:9001"
```

# All in one

How to test this?

1. [Install Docker Compose](https://docs.docker.com/compose/install/)
1. Clone this repository
1. Run all containers with `docker-compose up`