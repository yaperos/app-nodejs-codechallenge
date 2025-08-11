# Yape - Node.js Code Challenge

This is a microservices-based application with the following flow:

1. **transactions-api** (GraphQL) writes to Postgres Outbox and returns immediately.
2. **Outbox Drainer** processes the outbox and publishes to Kafka topics.
3. **anti-fraud** service consumes `TransactionCreated` events and publishes `TransactionValidated` events.
4. **transactions-command** service consumes `TransactionValidated` events for final processing.

# Prerequisites
- Node v22.18.0
- Docker Desktop
- npm

## Services

- **transactions-api**: Main GraphQL API that creates transactions
- **anti-fraud**: Fraud detection service
- **transactions-command**: Command processing service
- **outbox-drainer**: Reliable event publishing from database

## Environment
```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yape?schema=public

KAFKA_BROKERS=localhost:9092
KAKFA_CLIENT_ID=yape
KAKFA_CLIENT_ID=yape-cg
TX_API_CLIENT_ID=transactions-api
TX_API_GROUP_ID=transactions-api-cg
ANTI_FRAUD_CLIENT_ID=anti-fraud
ANTI_FRAUD_GROUP_ID=anti-fraud-cg
TX_CMD_CLIENT_ID=transactions-cmd
TX_CMD_GROUP_ID=transactions-cmg-cg

API_PORT=3000

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```


## Project setup

1. Move to the backend directory
```bash
cd backend
```

2. Start infrastructure:
```bash
npm run infra:up
```

3. Install dependencies
```bash
npm install
```

4. Prepare database:
```bash
npm run prisma:migrate:run
npm run prisma:generate
npm run db:seed
```

5. Start all services:
```bash
npm run dev:all
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Development

- **GraphQL Playground**: http://localhost:3000/graphql
- **Database**: PostgreSQL (via Docker)
- **Message Broker**: Kafka (via Docker)
- **Caching**: Redis (via Docker)


## Playground

```graphql
query TransactionTypes {
  transactionTypes {
    id
    name
  }
}
```

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    value
    createdAt
    transactionStatus
    transactionTypeName
    transactionExternalId
  }
}

{
  "input": {
    "accountExternalIdCredit": "50e14ce9-144e-4717-a5cd-76c0cd9556a2",
    "accountExternalIdDebit": "50e14ce9-144e-4717-a5cd-76c0cd9556a3",
    "transferTypeId": "872f6272-35db-4205-9779-93ebccde3fa7",
    "value": 1001
  }
}
```

```graphql
query Transaction($externalId: String!) {
  transaction(externalId: $externalId) {
    value
    createdAt
    transactionStatus
    transactionTypeName
    transactionExternalId
  }
}

{
 "externalId": "ef84357c-3d37-4f46-8297-a93d377e251e"
}
```

# Architecture

![](./architecture.svg)