# Yape Backend Developer Code Challenge Solution

## Design Decisions

I chose to use `pnpm` for managing dependencies efficiently and avoiding redundancy. This approach allows each project to have its own `package.json` and `.env` files, while still sharing common dependencies.

For the database, I used Couchbase, which is a distributed NoSQL document-oriented database. It can handle high volume scenarios with a large amount of reads and writes, making it suitable for this challenge.

For the messaging system, I used Kafka to handle communication between the Transaction and Antifraud microservices. This allows for asynchronous processing and high throughput.

For the web framework, I used Fastify, which is a high-performance web framework for Node.js. It is lightweight and efficient, making it a good choice for microservices.

I also included unit tests in each project to ensure the code is working as expected and to facilitate future maintenance.
This repository contains my solution to the Yape Backend Developer Code Challenge. 

The solution consists of three nested projects: `Transaction`, `Antifraud`, and `Libs`. 

## Project Structure

```
.
├── README.md
├── docker-compose.yml
├── libs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── src
│   │   ├── configuration
│   │   │   └── Configuration.ts
│   │   ├── domain
│   │   │   └── Domain.ts
│   │   ├── event
│   │   │   ├── EventDomain.ts
│   │   │   └── EventManager.ts
│   │   ├── exception
│   │   │   ├── BadRequestError.ts
│   │   │   ├── BaseError.ts
│   │   │   ├── ConfigurationError.ts
│   │   │   ├── ErrorFactory.ts
│   │   │   ├── InternalServerError.ts
│   │   │   └── NotFoundError.ts
│   │   ├── index.ts
│   │   └── kafkajs.ts
│   └── tsconfig.json
└── services
    ├── antifraud-ms
    │   ├── index.ts
    │   ├── jest.config.js
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── src
    │   │   ├── controller
    │   │   │   ├── Antifraud.schema.ts
    │   │   │   ├── AntifraudController.ts
    │   │   │   ├── __tests__
    │   │   │   │   └── AntifraudController.test.ts
    │   │   │   └── index.ts
    │   │   ├── domain
    │   │   │   └── Antifraud.ts
    │   │   ├── handlers
    │   │   │   └── index.ts
    │   │   ├── kafka.ts
    │   │   └── service
    │   │       ├── AntifraudServiceI.ts
    │   │       ├── AntifraudServiceImpl.ts
    │   │       ├── __tests__
    │   │       │   └── AntifraudServiceImpl.test.ts
    │   │       └── index.ts
    │   └── tsconfig.json
    └── transaction-ms
        ├── index.ts
        ├── jest.config.js
        ├── package.json
        ├── pnpm-lock.yaml
        ├── src
        │   ├── controller
        │   │   ├── Transaction.schema.ts
        │   │   ├── TransactionController.ts
        │   │   ├── __tests__
        │   │   │   └── TransactionController.test.ts
        │   │   └── index.ts
        │   ├── domain
        │   │   └── Transaction.ts
        │   ├── fastify.ts
        │   ├── handlers
        │   │   └── index.ts
        │   ├── kafka.ts
        │   ├── repository
        │   │   ├── TransactionRepositoryI.ts
        │   │   ├── TransactionRepositoryImpl.ts
        │   │   ├── __tests__
        │   │   │   └── TransactionRepositoryImpl.test.ts
        │   │   └── index.ts
        │   └── service
        │       ├── TransactionServiceI.ts
        │       ├── TransactionServiceImpl.ts
        │       ├── __tests__
        │       |   └── TransactionServiceImpl.test.ts
        │       └── index.ts
        ├── swagger
        │   └── Transaction.yml
        └── tsconfig.json
```

## Projects

### 1. Transaction Microservice

This microservice is responsible for handling transactions. It contains the necessary resources for creating and retrieving transactions, as well as communicating with the Antifraud microservice.

#### Environment Variables

```env
KAFKA_CLIENT_ID=transaction-ms
KAFKA_BROKER=127.0.0.1:9092
FASTIFY_PORT=3000
COUCHBASE_CONN_STR=couchbase://127.0.0.1
COUCHBASE_USERNAME=Administrator
COUCHBASE_PASSWORD=123456
COUCHBASE_BUCKET_NAME=transaction
```

### 2. Antifraud Microservice

This microservice is responsible for validating financial transactions. It receives transaction events and sends transaction status updates back to the Transaction microservice.

#### Environment Variables

```env
KAFKA_CLIENT_ID=antifraud-ms
KAFKA_BROKER=127.0.0.1:9092
TRANSACTION_MAX_AMOUNT=1000
```

### 3. Libraries

This project contains shared libraries and utility functions that are used by both the Transaction and Antifraud microservices.


## Getting Started

To run the solution, make sure you have `pnpm` installed.

Then, install the dependencies in every project using:

```sh
pnpm install
```

To start the Transaction microservice, navigate to the `services/transaction-ms` directory and run:

```sh
pnpm start
```

To start the Antifraud microservice, navigate to the `services/antifraud-ms` directory and run:

```sh
pnpm start
```

### Configuring database

Couchbase needs to be configured manually using its web UI, refer to the official [documentation.](https://github.com/docker-library/docs/tree/master/couchbase#quickstart-with-couchbase-server-and-docker)

Then create a bucket `COUCHBASE_BUCKET_NAME` to be used for storing transactions.

## Running Tests

To run the tests for both microservices, you can use the following commands:

For the Transaction microservice, navigate to the `services/transaction-ms` directory and run:

```sh
pnpm test
```

For the Antifraud microservice, navigate to the `services/antifraud-ms` directory and run:

```sh
pnpm test
```

These commands will execute the unit tests for the respective microservices and ensure that the implemented functionalities are working as expected.


## API Documentation

The Transaction microservice exposes the following endpoints:

### Create Transaction

- **Method:** `POST`
- **URL:** `/transaction`
- **Body:**

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "transferTypeId": 1,
  "value": 120
}
```

### Retrieve Transaction

- **Method:** `GET`
- **URL:** `/transaction/:transactionExternalId`
- **Response:**

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Scalability Considerations

To handle high volume scenarios with a large amount of reads and writes, I chose Couchbase as the database. Couchbase provides high performance, scalability, and availability, which are essential for the requirements of this challenge.

In addition, Kafka is used as the messaging system to enable asynchronous processing and high throughput between the microservices. This ensures that the system can handle a large number of transactions without being overwhelmed.
