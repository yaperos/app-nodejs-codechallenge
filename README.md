# Transaction Processing Platform

This repository contains a production-ready implementation of a transaction-processing platform built with Node.js and TypeScript. It is composed of two microservices that collaborate through Kafka to orchestrate the lifecycle of a financial transaction—from creation to anti-fraud screening and status updates.

- [Architecture](#architecture)
- [Microservices](#microservices)
- [Event Flow](#event-flow)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
- [Testing Strategy](#testing-strategy)
- [Operational Notes](#operational-notes)

## Architecture

The system follows a microservices and event-driven design. The **Transactions** service exposes GraphQL for API clients and persists state in PostgreSQL via Prisma. The **Anti-fraud** service is a Kafka worker that evaluates newly created transactions and emits approval or rejection events. A Postgres advisory-lock strategy delivers idempotent writes even under concurrent load.

```
Client → Transactions (GraphQL/HTTP)
   ↓
[Persist with status pending]
   ↓
[Publish transaction.created]
   ↓
Anti-fraud (Kafka consumer)
   ↓
[Run risk rules]
   ↓
[Publish transaction.status]
   ↓
Transactions (Kafka consumer)
   ↓
[Update status in Postgres]
```

## Microservices

### Transactions (`src/transactions`)
- Apollo Server (GraphQL) with schema-first resolvers.
- Prisma ORM connected to PostgreSQL for persistence.
- Kafka producer/consumer backed by KafkaJS.
- Advisory locks (`pg_advisory_xact_lock`) to guarantee idempotency across concurrent requests.
- Zod validation on all GraphQL entry points to enforce UUID formats, numeric ranges, and business constraints before hitting the database.

### Anti-fraud (`src/antifraud`)
- Stateless Kafka worker that consumes `transaction.created` events.
- Applies configurable business rules (currently rejects amounts above 1,000).
- Validates payloads with Zod to defend against malformed events before processing.
- Emits `transaction.status` events to keep the Transactions service synchronized.

## Event Flow

1. Client issues `createTransaction` mutation.
2. Transactions service validates payload, persists the transaction with `pending` status, acquires an advisory lock for idempotency, and publishes `transaction.created`.
3. Anti-fraud service consumes the event, validates structure, evaluates rules, and publishes `transaction.status` with `approved` or `rejected` outcome.
4. Transactions service consumes the status event and updates the transaction record accordingly.

## Tech Stack

- **Runtime:** Node.js 18, TypeScript 5.9, pnpm.
- **API:** Apollo Server, Mercurius utilities for GraphQL.
- **Data:** PostgreSQL 15, Prisma ORM.
- **Messaging:** Kafka (KafkaJS clients), Kafka Testcontainers for integration tests.
- **Validation:** Zod schemas across services.
- **Logging:** Pino with contextual child loggers.
- **Testing:** Jest + ts-jest, unit and integration (Testcontainers for Kafka/Postgres), concurrency coverage for advisory locks.
- **Containerization:** Dockerfiles per service (multi-stage builds) and `src/docker-compose.yml` for local orchestration.

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 10+
- Docker & Docker Compose

### Install & Bootstrap

1. **Start infrastructure**
   ```bash
   cd src
   docker-compose up -d
   ```

2. **Transactions service**
   ```bash
   cd src/transactions
   pnpm install
   pnpm prisma generate
   pnpm prisma migrate deploy
   pnpm prisma:seed
   pnpm dev   # http://localhost:3000/graphql
   ```

3. **Anti-fraud service**
   ```bash
   cd src/antifraud
   pnpm install
   pnpm dev
   ```

### Useful Scripts
- `pnpm test` (each service) – runs Jest unit and integration suites.
- `pnpm test:integration` – executes Testcontainers-based scenarios.
- `pnpm build` – TypeScript compilation (used inside Dockerfiles).
- `docker-compose up --build` from `src/` – builds and runs the full stack end-to-end.

## Testing Strategy

- **Unit tests** validate service logic with mocks (including Zod validation guards and advisory lock behaviour).
- **Integration tests** spin up Postgres and Kafka with Testcontainers to exercise database persistence, idempotency, and event choreography.
- **Concurrency tests** stress the advisory-lock implementation to ensure a single row is persisted across simultaneous requests.

Run the suites:

```bash
cd src/transactions && pnpm test
cd src/antifraud    && pnpm test
```

## Operational Notes

- Always run `pnpm prisma generate` after updating the Prisma schema to refresh the generated client.
- Docker images perform install → build → test within multi-stage builds to keep runtime layers slim and deterministic.
- Environment variables are validated with Zod at startup; missing or malformed configuration triggers a fail-fast shutdown.
- Kafka topics can be customized via environment variables (`KAFKA_TRANSACTION_TOPIC`, `KAFKA_STATUS_TOPIC`) to integrate with existing clusters.
