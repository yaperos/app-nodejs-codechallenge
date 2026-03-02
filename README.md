# Yape Anti-Fraud Transaction System

A microservices-based financial transaction system with real-time anti-fraud validation, built with **Java 17** and **Spring Boot 3**. Designed as a solution for the Yape Code Challenge (Java Backend Developer - Semi-Senior).

## Problem Statement

Every time a financial transaction is created, it must be validated by an anti-fraud microservice before being finalized. The anti-fraud service evaluates the transaction asynchronously and sends the result back to update the transaction status. Transactions exceeding a value of **1000** are automatically **rejected**; otherwise, they are **approved**. Communication between services is fully event-driven via **Apache Kafka**, ensuring loose coupling, resilience, and scalability.

---

## Architecture

```
┌─────────────┐     POST /transactions     ┌─────────────────────┐
│   Client    │ ─────────────────────────►  │ Transaction Service │
│             │ ◄─────────────────────────  │   (port 8080)       │
└─────────────┘     201 Created (PENDING)   │                     │
                                            │  ┌──────────────┐   │
      GET /transactions/:id                 │  │ PostgreSQL   │   │
┌─────────────┐ ────────────────────────►   │  │ (postgres-tx)│   │
│   Client    │ ◄────────────────────────   │  └──────────────┘   │
└─────────────┘     200 OK                  │  ┌──────────────┐   │
                                            │  │    Redis     │   │
                                            │  │   (cache)    │   │
                                            │  └──────────────┘   │
                                            └──────────┬──────────┘
                                                       │
                                          Kafka: transaction.created
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │ Antifraud Service   │
                                            │   (port 8081)       │
                                            │                     │
                                            │  ┌──────────────┐   │
                                            │  │ PostgreSQL   │   │
                                            │  │ (postgres-af)│   │
                                            │  └──────────────┘   │
                                            └──────────┬──────────┘
                                                       │
                                      Kafka: transaction.status.updated
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │ Transaction Service │
                                            │  (updates status)   │
                                            └─────────────────────┘
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Java** | 17 | Core language with modern features (records, sealed classes, pattern matching) |
| **Spring Boot** | 3.2.5 | Application framework with auto-configuration and embedded server |
| **Spring Data JPA** | 3.2.x | ORM and repository abstraction over Hibernate |
| **Spring Kafka** | 3.1.x | Kafka producer/consumer integration with manual offset commit |
| **Spring Data Redis** | 3.2.x | Redis client for caching with TTL support |
| **PostgreSQL** | 15 (Alpine) | Relational database for persistent storage (one per service) |
| **Redis** | 7 (Alpine) | In-memory cache for transaction reads |
| **HikariCP** | 5.x | High-performance JDBC connection pool (Spring Boot default) |
| **Flyway** | 10.x | Version-controlled database migrations |
| **Apache Kafka** | 7.5.0 (Confluent) | Event streaming platform for inter-service communication |
| **Docker + Docker Compose** | - | Containerization and multi-service orchestration |
| **Testcontainers** | 1.19.7 | Integration testing with real infrastructure (PostgreSQL, Kafka) |
| **Lombok** | - | Boilerplate reduction (builders, getters, loggers) |
| **Maven** | 3.9 | Build tool and dependency management |

---

## Project Structure

Both services follow **Hexagonal Architecture** (Ports & Adapters), ensuring clean separation between business logic and infrastructure concerns.

```
app-nodejs-codechallenge/
├── docker-compose.yml
├── README.md
│
├── transaction-service/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/yape/transaction/
│       ├── TransactionServiceApplication.java
│       │
│       ├── domain/                          # Core business logic (no framework dependencies)
│       │   ├── model/
│       │   │   ├── Transaction.java              # Domain entity
│       │   │   ├── TransactionStatus.java        # Enum: PENDING, APPROVED, REJECTED
│       │   │   └── TransferType.java             # Transfer type value object
│       │   └── port/
│       │       ├── in/                           # Inbound ports (use cases)
│       │       │   ├── CreateTransactionUseCase.java
│       │       │   └── GetTransactionUseCase.java
│       │       └── out/                          # Outbound ports (driven adapters)
│       │           ├── TransactionRepository.java
│       │           ├── TransactionEventPublisher.java
│       │           └── TransactionCachePort.java
│       │
│       ├── application/                     # Use case implementations (orchestration)
│       │   └── usecase/
│       │       ├── CreateTransactionUseCaseImpl.java
│       │       └── GetTransactionUseCaseImpl.java
│       │
│       └── infrastructure/                  # Framework & technology adapters
│           ├── rest/                             # REST API (driving adapter)
│           │   ├── TransactionController.java
│           │   └── dto/
│           │       ├── CreateTransactionRequest.java
│           │       └── TransactionResponse.java
│           ├── persistence/                      # JPA/PostgreSQL (driven adapter)
│           │   ├── adapter/
│           │   │   └── TransactionRepositoryAdapter.java
│           │   ├── entity/
│           │   │   ├── TransactionEntity.java
│           │   │   └── TransferTypeEntity.java
│           │   └── repository/
│           │       └── JpaTransactionRepository.java
│           ├── kafka/                            # Kafka producer & consumer
│           │   ├── KafkaConfig.java
│           │   ├── consumer/
│           │   │   └── TransactionStatusConsumer.java
│           │   ├── producer/
│           │   │   └── TransactionEventProducer.java
│           │   └── dto/
│           │       ├── TransactionCreatedEvent.java
│           │       └── TransactionStatusUpdatedEvent.java
│           └── cache/                            # Redis cache (driven adapter)
│               └── TransactionCacheAdapter.java
│
└── antifraud-service/
    ├── Dockerfile
    ├── pom.xml
    └── src/main/java/com/yape/antifraud/
        ├── AntifraudServiceApplication.java
        │
        ├── domain/                          # Core business logic
        │   ├── model/
        │   │   └── EvaluatedTransaction.java     # Domain entity
        │   └── port/
        │       ├── in/
        │       │   └── EvaluateTransactionUseCase.java
        │       └── out/
        │           ├── EvaluatedTransactionRepository.java
        │           └── TransactionStatusPublisher.java
        │
        ├── application/                     # Use case implementations
        │   └── usecase/
        │       └── EvaluateTransactionUseCaseImpl.java
        │
        └── infrastructure/                  # Framework & technology adapters
            ├── kafka/
            │   ├── KafkaConfig.java
            │   ├── consumer/
            │   │   └── TransactionCreatedConsumer.java
            │   ├── producer/
            │   │   └── TransactionStatusProducer.java
            │   └── dto/
            │       ├── TransactionCreatedEvent.java
            │       └── TransactionStatusUpdatedEvent.java
            └── persistence/
                ├── adapter/
                │   └── EvaluatedTransactionRepositoryAdapter.java
                ├── entity/
                │   └── EvaluatedTransactionEntity.java
                └── repository/
                    └── JpaEvaluatedTransactionRepository.java
```

---

## Prerequisites

- **Docker** >= 20.10
- **Docker Compose** >= 2.0

No local Java or Maven installation required -- everything builds inside Docker containers.

---

## How to Run

```bash
# Clone the repository
git clone https://github.com/ChristopherEspejo/app-nodejs-codechallenge.git
cd app-nodejs-codechallenge

# Start all services
docker-compose up --build

# Services will be available at:
# Transaction Service: http://localhost:8080
# Antifraud Service: http://localhost:8081 (no REST API - event-driven only)
```

Wait until you see both services log `Started *Application` before sending requests. The health checks ensure proper startup ordering: PostgreSQL and Redis must be healthy before the application services start, and Kafka must be ready before consumers begin listening.

To stop all services:

```bash
docker-compose down

# To also remove persisted data volumes:
docker-compose down -v
```

---

## API Endpoints

### Create Transaction

**POST** `/transactions`

Creates a new transaction with `PENDING` status and publishes an event for anti-fraud evaluation.

**Request:**

```json
{
  "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
  "accountExternalIdCredit": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "tranferTypeId": 1,
  "value": 120
}
```

**Response (201 Created):**

```json
{
  "transactionExternalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "PENDING"
  },
  "value": 120,
  "createdAt": "2026-02-27T10:30:00"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "tranferTypeId": 1,
    "value": 120
  }'
```

---

### Retrieve Transaction

**GET** `/transactions/{id}`

Retrieves a transaction by its external UUID. Returns the current status, which may have been updated asynchronously by the anti-fraud service.

**Response (200 OK):**

```json
{
  "transactionExternalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "APPROVED"
  },
  "value": 120,
  "createdAt": "2026-02-27T10:30:00"
}
```

**cURL Example:**

```bash
curl http://localhost:8080/transactions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

> **Note:** The status transitions from `PENDING` to `APPROVED` or `REJECTED` within milliseconds of creation, depending on Kafka and service processing latency.

---

## Event Flow

The following sequence describes the complete lifecycle of a transaction, from creation to final status:

```
  Client           Transaction Service          Kafka              Antifraud Service
    │                      │                      │                       │
    │  1. POST /transactions                      │                       │
    │─────────────────────►│                      │                       │
    │                      │                      │                       │
    │                      │ 2. Save (PENDING)    │                       │
    │                      │────► PostgreSQL      │                       │
    │                      │                      │                       │
    │                      │ 3. Publish event     │                       │
    │                      │─────────────────────►│                       │
    │                      │  transaction.created  │                       │
    │  4. 201 Created      │                      │                       │
    │◄─────────────────────│                      │                       │
    │     (PENDING)        │                      │ 5. Consume event      │
    │                      │                      │──────────────────────►│
    │                      │                      │                       │
    │                      │                      │  6. Idempotency check │
    │                      │                      │  7. Evaluate value    │
    │                      │                      │     > 1000? REJECTED  │
    │                      │                      │     <= 1000? APPROVED │
    │                      │                      │                       │
    │                      │                      │ 8. Publish result     │
    │                      │                      │◄──────────────────────│
    │                      │ transaction.status    │                       │
    │                      │       .updated        │                       │
    │                      │◄─────────────────────│                       │
    │                      │ 9. Update status     │                       │
    │                      │────► PostgreSQL      │                       │
    │                      │────► Redis cache     │                       │
    │                      │                      │                       │
    │  10. GET /transactions/{id}                 │                       │
    │─────────────────────►│                      │                       │
    │  200 OK (APPROVED    │                      │                       │
    │   or REJECTED)       │                      │                       │
    │◄─────────────────────│                      │                       │
```

**Step-by-step:**

1. **User creates transaction** via `POST /transactions`
2. **Transaction saved** to PostgreSQL with `PENDING` status
3. **Event published** to `transaction.created` Kafka topic
4. **Response returned immediately** to the client (non-blocking) -- the client does not wait for fraud evaluation
5. **Antifraud Service consumes** the event from Kafka
6. **Idempotency check** -- if the transaction was already evaluated (exists in `evaluated_transactions` table), skip processing
7. **Fraud evaluation** -- value > 1000 results in `REJECTED`, value <= 1000 results in `APPROVED`
8. **Result published** to `transaction.status.updated` Kafka topic
9. **Transaction Service updates** the status in PostgreSQL and refreshes the Redis cache
10. **GET endpoint** returns the final status (served from Redis cache when available)

---

## Kafka Topics

| Topic | Producer | Consumer | Payload | Purpose |
|---|---|---|---|---|
| `transaction.created` | Transaction Service | Antifraud Service | `{ transactionId, value }` | New transaction requiring fraud evaluation |
| `transaction.status.updated` | Antifraud Service | Transaction Service | `{ transactionId, status }` | Fraud evaluation result (APPROVED/REJECTED) |

Both services use **manual offset commit** (`ack-mode: MANUAL_IMMEDIATE`) to ensure messages are only acknowledged after successful processing and downstream publishing.

---

## Database Schema

### Transaction Service (`transactions_db`)

```sql
CREATE TABLE transactions (
    id              BIGSERIAL PRIMARY KEY,
    external_id     UUID NOT NULL UNIQUE,
    account_debit   UUID NOT NULL,
    account_credit  UUID NOT NULL,
    transfer_type_id INT NOT NULL,
    value           DECIMAL(15,2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP
);

CREATE INDEX idx_transactions_external_id ON transactions(external_id);

CREATE TABLE transfer_types (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
```

### Antifraud Service (`antifraud_db`)

```sql
CREATE TABLE evaluated_transactions (
    transaction_id UUID PRIMARY KEY,
    status         VARCHAR(20) NOT NULL,
    evaluated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

All schemas are managed through **Flyway migrations**, ensuring version-controlled, repeatable database changes across environments.

---

## Technical Decisions

### Kafka over HTTP for Inter-Service Communication

Asynchronous, non-blocking communication via Kafka decouples the two services entirely. The `POST /transactions` endpoint returns immediately with a `PENDING` status without waiting for fraud validation. This provides resilience: if the antifraud service is temporarily unavailable, messages queue in Kafka and are processed once the service recovers. There is no temporal coupling between producer and consumer.

### Manual Kafka Offset Commit

Both consumers use `enable-auto-commit: false` with `ack-mode: MANUAL_IMMEDIATE`. The offset is committed **only after** the message has been fully processed (database write + downstream event published). If the service crashes mid-processing, Kafka redelivers the unacknowledged message on restart. This prevents message loss at the cost of potential duplicates, which is handled by the idempotency mechanism.

### Idempotency in the Antifraud Service

Kafka guarantees **at-least-once** delivery, meaning duplicate messages can occur during rebalances or retries. The antifraud service records each evaluated `transactionId` in a dedicated database table. Before processing, it checks whether the transaction has already been evaluated, skipping duplicates. This makes the consumer safely idempotent.

### Redis Cache with Differentiated TTL

Transactions are cached in Redis with TTLs based on their status. `PENDING` transactions get a **30-second TTL** because the status will change shortly. `APPROVED` and `REJECTED` transactions receive a **10-minute TTL** because they represent a final, immutable state. This strategy optimizes read performance while preventing stale data.

### HikariCP Tuned Configuration

Both services configure HikariCP explicitly with `maximum-pool-size: 20` and `minimum-idle: 5`, rather than relying on Spring Boot defaults (10 max). This prevents connection pool exhaustion under concurrent load and ensures stable database access. Connection timeout (30s), idle timeout (10m), and max lifetime (30m) are tuned for a containerized environment.

### PostgreSQL Index on `external_id`

A B-tree index on `transactions.external_id` provides **O(log n)** lookups for the `GET /transactions/{id}` endpoint. Without this index, every retrieval would require a full table scan, which degrades rapidly as transaction volume grows.

### Hexagonal Architecture (Ports & Adapters)

The domain layer (`domain/model`, `domain/port`) contains pure business logic with **zero framework dependencies**. Use cases in the application layer orchestrate the flow. Infrastructure adapters (REST controllers, JPA repositories, Kafka consumers/producers, Redis cache) are pluggable and can be replaced without modifying business logic. This makes the codebase testable, maintainable, and framework-agnostic at its core.

### Flyway Database Migrations

Schema changes are version-controlled SQL files (`V1__create_transactions_table.sql`, etc.) executed automatically on startup. This guarantees database consistency across local, staging, and production environments and eliminates manual DDL execution.

### Multi-Stage Docker Builds

Both services use multi-stage Dockerfiles: Maven builds the JAR in the first stage, and a minimal `eclipse-temurin:17-jre-alpine` image runs it in the second stage. This reduces the final image size significantly and runs the application as a non-root user (`appuser`) for security.

### Separate Databases per Service

Each microservice owns its database (`transactions_db` and `antifraud_db`), following the **Database per Service** pattern. This ensures loose coupling at the data layer -- services cannot directly query each other's tables, forcing all communication through Kafka events.

---

## Running Tests

Both services include integration test dependencies with **Testcontainers** for testing against real PostgreSQL and Kafka instances.

```bash
# Run tests for transaction-service
cd transaction-service
mvn test

# Run tests for antifraud-service
cd antifraud-service
mvn test

# Run tests for both services from the project root
(cd transaction-service && mvn test) && (cd antifraud-service && mvn test)
```

> **Note:** Running tests locally requires Docker to be running, as Testcontainers spins up PostgreSQL and Kafka containers during test execution.

---

## Future Improvements

| Improvement | Description |
|---|---|
| **CQRS** | Separate read and write databases for independent scalability of query and command workloads |
| **Circuit Breaker** | Resilience4j integration for fault tolerance, preventing cascading failures between services |
| **Metrics & Monitoring** | Micrometer + Prometheus + Grafana stack for real-time observability, latency tracking, and alerting |
| **Dead Letter Queue (DLQ)** | Route messages that fail processing after N retries to a dead letter topic for manual inspection |
| **API Gateway** | Centralized entry point with rate limiting, authentication (JWT), and request routing |
| **Schema Registry** | Confluent Schema Registry with Avro or Protobuf schemas for Kafka events, enabling safe schema evolution |
| **Event Sourcing** | Store all state changes as an immutable event log for full audit trail and temporal queries |
| **Distributed Tracing** | OpenTelemetry integration for end-to-end request tracing across services and Kafka |

---

## Author

**Christopher Espejo** -- [GitHub](https://github.com/ChristopherEspejo)
