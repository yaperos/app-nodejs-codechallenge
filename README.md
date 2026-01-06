
## Overview

This project implements a transaction processing system with asynchronous antifraud validation using an event-driven microservices architecture.

Every transaction is:

- Created with an initial pending status
- Sent to an antifraud service via Kafka
- Validated asynchronously
- Updated to approved or rejected

The solution prioritizes decoupling, scalability, and eventual consistency, following real-world financial system patterns.


## Architecture

[Grafic](https://drive.google.com/file/d/1OkKfq8jrwy62WnkhHKUrhjgYM3QiBgFL/view?usp=sharing)


## Design Decisions

**Why Kafka?**

- Decouples transaction creation from antifraud validation
- Allows horizontal scaling of antifraud workers
- Enables eventual consistency
- Prevents tight coupling between services

**Why separate Antifraud Service?**

- Each microservice owns a single responsibility
- Antifraud does not access the transaction database
- Communication happens only through events

**Why asynchronous validation?**

- Transactions are not blocked by antifraud latency
- System remains responsive under high load
- Mirrors real banking / fintech flows


## Services

■ Transaction Service

- REST API (NestJS)

- PostgreSQL persistence (Prisma)

- Kafka producer & consumer

- Manages transaction lifecycle

■ Antifraud Service

- Kafka consumer & producer only

- No HTTP server

- No database

- Applies antifraud rule:

    » value > 1000 → rejected

    » otherwise → approved
## API Reference

#### Create Transaction

```http
  POST /transactions
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_keyaccountExternalIdDebit` | `string` | **Required**.|
| `accountExternalIdCredit` | `string` | **Required**. |
| `tranferTypeId` | `int` | **Required**. 1 for Yapeo/2 for Pago de Servicios/3 for Recarga de Celular |
| `value` | `float` | **Required**. |

#### Get Transaction

```http
  GET /transactions/${transactionExternalId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `transactionExternalId`      | `string` | **Required**.|




## Running Tests
**Unit Tests**

- Business rules validation
- Initial transaction status
- Kafka producer mocked

**E2E Tests**

- POST /transactions
- GET /transactions/:id
- Prisma and Kafka mocked

To run tests, run the following command

```bash
  npm run test
```


## Deployment

**Requirements**

- Docker

- Docker Compose

Run everything: 

```bash
  docker compose up --build
```
This starts:

- PostgreSQL
- Zookeeper
- Kafka
- Transaction Service (port 3000)
- Antifraud Service (worker)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"`


## Feedback

If you have any feedback, please reach out to us at andersson26012000@gmail.com


## Authors

- Piero Andersson Sanchez Bazan (BackEnd Developer)