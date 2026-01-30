# Yape Code Challenge - Enterprise Solution :rocket:

[![Postman Collection](https://img.shields.io/badge/Postman-Collection-orange?logo=postman)](https://www.postman.com/me-juda-carrillo/yape-code-challenge/)

## Table of Contents

- [Overview](#overview)
- [Solution Architecture](#solution-architecture)
- [Problem Resolution](#problem-resolution)
- [Why Quarkus?](#why-quarkus)
- [Enterprise Features](#enterprise-features)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [API Usage](#api-usage)
- [Testing](#testing)

---

## Overview

This solution implements a **production-ready microservices architecture** for the Yape Code Challenge, demonstrating how a fintech company would build a scalable transaction processing system.

**Key Highlights:**
- Event-Driven Architecture with Apache Kafka & Avro
- GraphQL API (instead of REST)
- Clean Architecture + CQRS Pattern
- Multi-layer Caching with Redis
- 94% Test Coverage

---

## Solution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (GraphQL)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MS-TRANSACTION (:18080)                              │
│  GraphQL → Use Cases → Domain Services → [PostgreSQL, Redis, Kafka]         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              │ transaction.created        transaction.status │
              ▼                                               ▲
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MS-ANTI-FRAUD (:18081)                              │
│     Kafka Consumer → Validation Service → Kafka Producer                     │
│                    (Reject if value > 1000)                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PostgreSQL:5432 │ Redis:6379 │ Kafka:9092 │ Schema Registry:8081           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Problem Resolution

| Requirement | Implementation |
|-------------|---------------|
| Create transaction with pending status | ✅ GraphQL mutation saves with `PENDING` status |
| Anti-fraud validation via messaging | ✅ Kafka event to `transaction.created` topic |
| Reject transactions > 1000 | ✅ `AntiFraudValidationService` validates threshold |
| Update status via messaging | ✅ Response via `transaction.status` topic |
| High-volume support | ✅ Redis caching + Kafka async processing |

---

## Why Quarkus?

| Metric | Spring Boot | Quarkus JVM | Quarkus Native |
|--------|-------------|-------------|----------------|
| Startup Time | ~3-5s | ~0.8s | ~15ms |
| Memory (RSS) | ~300MB | ~150MB | ~35MB |
| Docker Image | ~300MB | ~200MB | ~70MB |

**Enterprise Benefits:**
- **Cloud-Native**: Built for Kubernetes & containers
- **Native Compilation**: GraalVM support for serverless
- **Reactive**: Non-blocking Kafka processing
- **Developer Experience**: Live reload with `quarkus:dev`
- **Standards**: MicroProfile, Jakarta EE, Vert.x

---

## Enterprise Features

### Clean Architecture
```
src/main/java/com/yape/services/
├── expose/graphql/         # GraphQL Resolvers
├── transaction/
│   ├── application/        # Use Cases, Commands, Queries
│   ├── domain/             # Models, Repository Interfaces
│   └── infrastructure/     # PostgreSQL, Redis, Kafka
└── shared/exception/       # Error Handling
```

### Event-Driven with Avro Schemas
- Schema evolution with Confluent Schema Registry
- Type-safe serialization
- Request traceability via `requestId`

### Caching Strategy
| Status | TTL | Rationale |
|--------|-----|-----------|
| PENDING | 5 min | Status will change |
| APPROVED/REJECTED | 1 hour | Final state |

---

## Technical Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Quarkus | 3.31.1 |
| Language | Java | 21 |
| API | SmallRye GraphQL | - |
| Database | PostgreSQL | 14 |
| Cache | Redis | 8 |
| Messaging | Kafka + Avro | 7.9.0 |
| ORM | Hibernate Panache | - |
| Migrations | Flyway | - |

---

## Getting Started

### Prerequisites
- Docker & Docker Compose

### 1. Start All Services
```bash
docker-compose up -d
```

This command starts all services:
- **PostgreSQL** (:5432) - Transaction database
- **Redis** (:6379) - Caching layer
- **Zookeeper** (:2181) - Kafka coordination
- **Kafka** (:9092) - Event streaming
- **Schema Registry** (:8081) - Avro schema management
- **ms-transaction** (:18080) - Transaction microservice
- **ms-anti-fraud** (:18081) - Anti-fraud microservice

### 2. Verify Health
```bash
# Wait ~2 minutes for services to be ready, then:
curl http://localhost:18080/ms-transaction/health
curl http://localhost:18081/ms-anti-fraud/health
```

### 3. Stop Services
```bash
docker-compose down
```

### Development Mode (Optional)
For local development with hot-reload:
```bash
# Start only infrastructure
docker-compose up -d postgres redis zookeeper kafka schema-registry

# Run microservices locally
cd ms-transaction && ./mvnw quarkus:dev
cd ms-anti-fraud && ./mvnw quarkus:dev
```

---

## API Usage

### Step 1: Fetch Transfer Types

```graphql
query {
  transferTypes {
    transferTypeId
    name
  }
}
```

![Fetch Transfer Types](assets/01-success-fetch-transfer-types.png)

---

### Step 2: Create Transaction

```graphql
mutation {
  createTransaction(input: {
    accountExternalIdDebit: "550e8400-e29b-41d4-a716-446655440000"
    accountExternalIdCredit: "550e8400-e29b-41d4-a716-446655440001"
    transferTypeId: 1
    value: "500.00"
  }) {
    transactionExternalId
    transactionStatus { name }
    value
    createdAt
  }
}
```

![Create Transaction](assets/02-success-create-transaction.png)

---

### Step 3: Fetch Transaction

```graphql
query {
  transaction(transactionExternalId: "YOUR_TRANSACTION_ID") {
    transactionExternalId
    transactionType { name }
    transactionStatus { name }
    value
    createdAt
  }
}
```

![Fetch Transaction](assets/03-success-fetch-transaction.png)

---

## Testing

### Run Tests
```bash
cd ms-transaction && ./mvnw test
cd ms-anti-fraud && ./mvnw test
```

### Coverage Report
```bash
./mvnw verify
# Report: target/site/jacoco/index.html
```

**ms-transaction: 94% coverage**

| Package | Coverage |
|---------|----------|
| application.usecase | 94% |
| application.query | 100% |
| infrastructure.cache | 100% |
| infrastructure.messaging | 100% |

---

## Author

**Juda Carrillo** - Tech Lead | Senior Backend Developer  
📧 [jbcp2006@gmail.com](mailto:jbcp2006@gmail.com)
