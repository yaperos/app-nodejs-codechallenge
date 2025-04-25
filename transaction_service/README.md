
# Transaction service v1.0.0

## Description

The Transaction service is a core microservice responsible for the creation and retrieval of financial transactions.

It implements the CQRS (Command Query Responsibility Segregation) pattern to optimize performance in high-volume scenarios, separating write operations (commands) from read operations (queries).

Writes are handled in a PostgreSQL database, while reads are served from a Redis cache for maximum speed.

Communication with other services and cache updates are handled asynchronously and reactively using Apache Kafka and Debezium.

## Architecture and Technical Details

- **Framework:** NestJS (Node.js, TypeScript)
- **API:** GraphQL (managed by `@nestjs/graphql` and `@nestjs/apollo`)
- **Write Database:** PostgreSQL 15
- **Read Database / Cache:** Redis 7
- **Messaging / Event Streaming:** Apache Kafka
- **Change Data Capture (CDC):** Debezium (running in Kafka Connect)
- **Patterns:** CQRS, Event-Driven Architecture (EDA), Microservices
- **ORM:** TypeORM
- **Package Manager:** pnpm (or npm/yarn depending on your project)

## Prerequisites

- Docker and Docker Compose
- Node.js (v20 or higher recommended)
- pnpm (or npm/yarn)
- Git
- (Requires the base ecosystem — Kafka, Zookeeper, Debezium/Connect).

## API Documentation (GraphQL)

The service exposes a GraphQL API to interact with transactions.

- **Endpoint:** `http://localhost:<TRANSACTION_SERVICE_PORT>/graphql` (e.g., `http://localhost:3000/graphql`)
- **Recommended Tool (Development):** Apollo Sandbox (accessible in the browser at the endpoint above if `playground: true` is enabled).

### Mutations

#### `createTransaction`

Creates a new transaction in the system. The transaction is initially saved in PostgreSQL with a `pending` status.

Subsequent processing (anti-fraud validation, status and cache update) occurs asynchronously.

- **Input:** `CreateTransactionInput!`
  - `accountExternalIdDebit: ID!` (UUID)
  - `accountExternalIdCredit: ID!` (UUID, different from debit)
  - `transferTypeId: Int!` (Transfer type ID, >= 1)
  - `value: Float!` (Transaction amount, > 0, max 2 decimals)
- **Output:** `Transaction` (The initial status returned will be `pending`)

- **Mutation Example:**

```graphql
mutation CreateNewTransaction {
  createTransaction(
    input: {
      accountExternalIdDebit: "7aed7998-0170-4284-b867-10e882629772"
      accountExternalIdCredit: "4aed5998-0170-4284-a876-10e882629673"
      transferTypeId: 1
      value: 120.50
    }
  ) {
    transactionExternalId
    value
    createdAt
    transactionType {
      name
    }
    transactionStatus {
      name # <-- Will return "pending"
    }
  }
}
```

### Queries

#### `getTransaction`

Retrieves the details of a specific transaction **by reading directly from the Redis cache (Read DB)**.

Returns the most up-to-date status known to the cache (eventually consistent).

- **Argument:** `transactionExternalId: ID!` (UUID of the transaction to query)
- **Output:** `Transaction | null` (Returns `null` if the transaction is not found in the cache)

- **Query Example:**

```graphql
query GetTransactionById {
  getTransaction(transactionExternalId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
    transactionExternalId
    value
    createdAt
    transactionType {
      name
    }
    transactionStatus {
      name # <-- Will return current cache status (pending, approved, rejected)
    }
  }
}
```

### Main Types (GraphQL Schema)

```graphql
# Represents an individual transaction
type Transaction {
  transactionExternalId: ID!
  transactionType: TransactionTypeInfo!
  transactionStatus: TransactionStatusInfo!
  value: Float!
  createdAt: DateTime!
}

# Information about the transaction type
type TransactionTypeInfo {
  name: String!
}

# Information about the transaction status
type TransactionStatusInfo {
  name: String! # "pending", "approved", "rejected"
}

# Input for creating a transaction
input CreateTransactionInput {
  accountExternalIdDebit: ID!
  accountExternalIdCredit: ID!
  transferTypeId: Int!
  value: Float!
}
```
