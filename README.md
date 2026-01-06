# Yape Code Challenge – Async Payment Transaction Platform (Java 21)

## Overview

This solution implements an event-driven microservices architecture for financial transaction processing and anti-fraud validation.

The platform is composed of two independent microservices communicating asynchronously through Apache Kafka:

- **ms-payment-transaction-command**
  - Exposes REST APIs to create and retrieve transactions.
  - Persists transactions with initial `PENDING` status.
  - Publishes `TransactionCreated` events.
  - Consumes validation results and updates transaction status.

- **ms-risk-antifraud-evaluation**
  - Consumes created transaction events.
  - Applies anti-fraud rules.
  - Publishes validation results (`APPROVED` / `REJECTED`).

The solution follows **Hexagonal Architecture** and applies the **Transactional Outbox Pattern** to guarantee consistency between database state and published Kafka events.

---

## Architecture

- Java 21 / Spring Boot 3
- Apache Kafka (event backbone)
- PostgreSQL (transactional persistence)
- Transactional Outbox Pattern
- Idempotent Kafka consumers
- Optimistic concurrency control
- Docker Compose local environment

---

## Event Flow

1. Client creates transaction → status `PENDING`
2. Transaction service stores transaction and outbox event
3. Outbox publisher emits `payment.transaction.created.v1`
4. Anti-fraud service validates business rule
5. Anti-fraud publishes `payment.transaction.validated.v1`
6. Transaction service consumes result and updates transaction status

---

## Running locally

### Start infrastructure only (Kafka + Postgres)

```bash
docker compose up -d

Kafka UI
http://localhost:8088

PostgreSQL
localhost:5432
user: postgres
password: postgres
db: yape


Start full platform (infra + microservices)

docker compose --profile apps up -d --build


REST API
Create transaction

POST http://localhost:8081/transactions
json

{
  "accountExternalIdDebit": "a1c1e3d4-1111-4bda-8c01-abc123",
  "accountExternalIdCredit": "b2f2a3d4-2222-4bda-8c01-def456",
  "tranferTypeId": 1,
  "value": 120
}


Get transaction

GET http://localhost:8081/transactions/{transactionExternalId}

Response:

{
  "transactionExternalId": "uuid",
  "transactionType": { "name": "TRANSFER" },
  "transactionStatus": { "name": "APPROVED" },
  "value": 120,
  "createdAt": "2026-01-06T13:10:00Z"
}

Kafka Topics

payment.transaction.created.v1

payment.transaction.validated.v1

payment.transaction.created.dlq.v1

payment.transaction.validated.dlq.v1

High concurrency & reliability strategy

This solution is designed for high-write / high-read scenarios:

Transactional outbox to avoid dual-write problems

Kafka-based async processing

Idempotent consumers

Conditional updates (WHERE status = 'PENDING')

Indexed reads

Optimistic locking

Horizontal scalability

Design principles

Hexagonal architecture

Clear domain boundaries

Infrastructure isolation

Event-driven communication

Production-oriented reliability patterns

Notes

This implementation prioritizes reliability, scalability and data consistency, following real-world banking-grade asynchronous processing patterns.


