<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# <p align="center"> Yape transactions microservice </p>

Transaction microservice built with NestJS, gRPC, PostgreSQL, TypeORM, CQRS, and Kafka. It exposes gRPC methods to create and retrieve transactions, persists data in a database, and publishes/consumes events in Kafka for the transaction validation flow.

## Features

- gRPC as transport (no HTTP REST exposed).
- CQRS (Commands/Queries) to decouple use cases.
- PostgreSQL + TypeORM for persistence.
- Kafka for publishing and consuming transaction events.
- Validation for environment variables and DTOs.

## Requirements

- Node.js >= 18
- pnpm >= 9
- PostgreSQL >= 14
- Kafka (accessible broker)

## Environment variables

The service strictly validates the following variables. You can use the `.env.example` file as a base (copy to `.env`).

- NODE_ENV: development | production | test
- HOST: Host where the gRPC microservice listens (e.g., 127.0.0.1)
- PORT: gRPC port (e.g., 6002)
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_MAX_CONNECTIONS, DB_MIN_CONNECTIONS
- KAFKA_URL: broker host:port (e.g., 127.0.0.1:9092)
- KAFKA_TRANSACTIONS_TOPIC: topic where the created transaction is published (default transactions.created)
- KAFKA_TRANSACTIONS_VALIDATED_TOPIC: consumer topic to update status (default transactions.validated)
- KAFKA_TRANSACTIONS_CONSUMER_GROUP: Kafka consumer groupId

See `.env.example` for reference values.

## Installation

- Install dependencies:
  - pnpm install

## Running

The microservice starts a gRPC server using the definition in `src/protos/transaction.proto` and listens on `HOST:PORT`.

- Development (watch):
  - pnpm run start:dev
- Development (simple):
  - pnpm run start
- Production (built):
  - pnpm run build
  - pnpm run start:prod

Make sure PostgreSQL and Kafka are available and environment variables are set before starting.

## gRPC schema

Proto: `src/protos/transaction.proto`

Service: `transaction.Transaction`

Methods:
- CreateTransaction(CreateTransactionRequest) -> TransactionResponse
- RetrieveTransaction(RetrieveTransactionRequest) -> TransactionResponse

Messages (summary):
- CreateTransactionRequest
  - accountExternalIdDebit (string UUID)
  - accountExternalIdCredit (string UUID)
  - transferTypeId (int32)
  - value (float)
- RetrieveTransactionRequest
  - transactionId (string UUID)
- TransactionResponse
  - transactionId (string)
  - transactionType { name }
  - transactionStatus { name }
  - value (float)
  - createdAt (ISO string)

## Try with grpcurl

Examples assuming `.env` with HOST=127.0.0.1 and PORT=6002:

- Create transaction:
  - grpcurl -plaintext -d '{"accountExternalIdDebit":"11111111-1111-1111-1111-111111111111","accountExternalIdCredit":"22222222-2222-2222-2222-222222222222","transferTypeId":1,"value":100.5}' 127.0.0.1:6002 transaction.Transaction/CreateTransaction

- Retrieve transaction:
  - grpcurl -plaintext -d '{"transactionId":"<RETURNED_UUID>"}' 127.0.0.1:6002 transaction.Transaction/RetrieveTransaction

Note: You can also use Evans or another gRPC client.

## Database

Tables expected by TypeORM:
- transaction_types
  - id (PK, serial)
  - name (text)
- transactions
  - transaction_id (uuid PK)
  - account_external_id_debit (uuid)
  - account_external_id_credit (uuid)
  - transfer_type_id (int)
  - value (decimal(12,2))
  - status (varchar, typical values: PENDING, APPROVED, REJECTED)
  - created_at, updated_at, deleted_at

Make sure to pre-load the `transaction_types` table with valid types (e.g., 1 -> DEPOSIT, 2 -> WITHDRAW, etc.), since the service validates the existence of the type before creating a transaction.

## Kafka events

- Publishes to: `${KAFKA_TRANSACTIONS_TOPIC}` when a transaction is created.
- Subscribes to: `${KAFKA_TRANSACTIONS_VALIDATED_TOPIC}` and updates the transaction status upon receiving a message with the following payload:

  {
    "transactionId": "<uuid>",
    "status": "APPROVED" | "REJECTED"
  }

Adjust topic names in your `.env` according to your environment.

## Available scripts

- pnpm run build: Compile to dist
- pnpm run start: Start in simple development mode
- pnpm run start:dev: Watch mode
- pnpm run start:prod: Run dist/main
- pnpm run lint: Linter with ESLint
- pnpm run test: Unit tests with Jest
- pnpm run test:e2e: E2E tests
- pnpm run test:cov: Coverage

## Project structure (summary)

- src/
  - main.ts: gRPC bootstrap (uses HOST and PORT)
  - app.module.ts: global configuration (ConfigModule, TypeORM, Kafka)
  - cases/transactions: gRPC controller, CQRS, entity and repository
  - cases/transaction_types: use cases and types repository
  - common/kafka: Kafka integration (producer/consumer)
  - protos/transaction.proto: gRPC contract

## License

This project is distributed as UNLICENSED (see package.json). Use only for challenge/technical test purposes.
