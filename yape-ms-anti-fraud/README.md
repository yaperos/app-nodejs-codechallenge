<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# <p align="center"> Yape anti-fraud microservice </p>

Anti-Fraud service built with NestJS that validates transactions received via Kafka and exposes a gRPC microservice for health-check (Ping). The service consumes transaction events, applies a simple validation rule, and publishes the validation result to another Kafka topic.

Last updated: 2025-08-09 17:59

## Features

- NestJS 11 with gRPC microservice (proto at `src/protos/antifraud.proto`).
- Kafka integration (kafkajs) for consuming and producing messages.
- Payload validation with `class-validator` and `class-transformer`.
- CQRS to decouple validation logic (`ValidateTransactionCommand`).
- Strict environment variable validation at startup.

## Architecture (high level)

- gRPC: `Antifraud` service with `Ping` method to check availability.
- Kafka:
  - Consumes from the topic configured in `KAFKA_TRANSACTIONS_TOPIC` (default: `transactions.created`).
  - Publishes results to `KAFKA_TRANSACTIONS_VALIDATED_TOPIC` (default: `transactions.validated`).
- Current business rule: If `value > 1000` => `status = rejected`; otherwise `status = approved`.

## Requirements

- Node.js 18+ (recommended) or higher.
- PNPM (recommended) or NPM/Yarn.
- Reachable Kafka broker (can be local at `127.0.0.1:9092`).

## Installation

- Clone the repository and navigate to the project folder.
- Install dependencies:
  - PNPM: `pnpm install`
  - NPM: `npm install`

## Environment variables

Copy `.env.example` to `.env` and adjust values:

- NODE_ENV: runtime environment (development | production | test | provision).
- HOST: gRPC host to expose (e.g., `127.0.0.1`).
- PORT: gRPC port (e.g., `6003`).
- KAFKA_URL: Kafka broker address (e.g., `127.0.0.1:9092`).
- KAFKA_TRANSACTIONS_TOPIC: input Kafka topic (e.g., `transactions.created`).
- KAFKA_TRANSACTIONS_VALIDATED_TOPIC: output Kafka topic (e.g., `transactions.validated`).
- KAFKA_TRANSACTIONS_CONSUMER_GROUP: consumer group (e.g., `yape-ms-antifraud`).

Note: Startup validates that all required variables exist and have the correct format.

## Run the service

- Development (watch mode): `pnpm run start:dev`
- Development (single run): `pnpm run start`
- Production (after build):
  - `pnpm run build`
  - `pnpm run start:prod`

The gRPC microservice will listen on `HOST:PORT` defined in `.env`.

## gRPC interaction

- Proto: `src/protos/antifraud.proto`
- Service: `Antifraud`
- Method: `Ping(Empty) -> { message: string }`

Example call (pseudo-code):

- Request: `Empty {}`
- Response: `{ message: "pong" }`

## Kafka flow

1. Consumer: subscribed to `KAFKA_TRANSACTIONS_TOPIC`.
2. Upon receiving a message, it is validated against the `TransactionRequestDto` DTO:
   - Fields: id, accountExternalIdDebit, accountExternalIdCredit, transactionStatusName, transferTypeId, value, createdAt.
3. The `status` is determined based on `value`.
4. It publishes to `KAFKA_TRANSACTIONS_VALIDATED_TOPIC` the payload:
   - `{ transactionId: string, status: "approved" | "rejected" }`

Example input message (JSON):
{
"id": "tx_123",
"accountExternalIdDebit": "acc_debit",
"accountExternalIdCredit": "acc_credit",
"transactionStatusName": "pending",
"transferTypeId": 1,
"value": 500,
"createdAt": "2025-08-09T17:55:00.000Z"
}

Example output message (JSON):
{
"transactionId": "tx_123",
"status": "approved"
}

## Useful scripts

- Lint: `pnpm run lint`
- Format: `pnpm run format`
- Unit tests: `pnpm run test`
- E2E tests: `pnpm run test:e2e`
- Coverage: `pnpm run test:cov`

## Project structure (overview)

- `src/main.ts`: gRPC microservice bootstrap.
- `src/app.module.ts`: root modules (Config, Kafka, AntiFraud).
- `src/cases/anti-fraud/*`: gRPC controller (Ping), service, and CQRS commands (validation).
- `src/common/kafka/*`: Kafka module and service (consumer/producer).
- `src/common/validators/*`: environment variable validation.
- `src/common/helpers/*`: DTO validation utilities and gRPC error helpers.
- `src/protos/antifraud.proto`: gRPC definition.

## Deployment notes

- Ensure Kafka is available and reachable from the service.
- Properly configure `HOST` and `PORT` to expose gRPC in your infrastructure.

## License

This project is delivered as "UNLICENSED" according to `package.json`. Adjust the license if it fits your use case.
