# Yape Transaction Service

## Overview

Event-driven microservices system for processing financial transactions with anti-fraud validation using Apache Kafka.

## Architecture

The project consists of two microservices:

**transaction-service** — Core service built with Onion Architecture (DDD). Handles transaction creation, persistence, and status updates.

**anti-fraud-service** — Lightweight worker service that consumes transaction events, validates fraud rules, and publishes the result.

### Event Flow

```
1. Client creates a transaction via REST API
2. Transaction is saved in PostgreSQL with status PENDING
3. transaction-service publishes event to Kafka topic "transaction.created"
4. anti-fraud-service consumes the event and validates:
   - Amount <= 1000 → APPROVED
   - Amount > 1000  → REJECTED
5. anti-fraud-service publishes result to Kafka topic "transaction.status"
6. transaction-service consumes the event and updates the status in the database
```

### Project Structure

```
transaction-service/          → Onion Architecture (DDD)
├── domain/                   → Entities, enums, repository interfaces
├── application/              → Use cases, ports (interfaces), DTOs
└── infrastructure/           →  JPA, Kafka producers/consumers
└── Presentation Layer/       → REST API, Spring controllers, exceptions handlers

anti-fraud-service/           → Simple structure
├── models/                   → TransactionEvent, TransactionStatus enum
└── consumers/                → Kafka consumer + producer logic
```

## Tech Stack

- Java 21
- Spring Boot 4.x
- Apache Kafka (Confluent 5.5.3)
- PostgreSQL 14
- MapStruct
- Lombok
- Springdoc OpenAPI (Swagger)

## Prerequisites

- Java 21
- Docker & Docker Compose
- Maven

## Getting Started

### 1. Start infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL, Zookeeper, and Kafka.

### 2. Run transaction-service

```bash
cd transaction-service
mvn spring-boot:run
```

Runs on `http://localhost:8080`

### 3. Run anti-fraud-service

```bash
cd anti-fraud-service
mvn spring-boot:run
```

Runs as a Kafka worker (no HTTP server).

## API Documentation

Swagger UI available at: `http://localhost:8080/`

### Endpoints

**POST** `/transactions` — Create a new transaction

```json
{
  "accountExternalIdDebit": "uuid",
  "accountExternalIdCredit": "uuid",
  "transferTypeId": 1,
  "value": 500
}
```

**GET** `/transactions/{id}` — Get transaction by external ID

Returns transaction with current status (PENDING, APPROVED, or REJECTED).

## Kafka Topics

| Topic | Producer | Consumer | Description |
|---|---|---|---|
| `transaction.created` | transaction-service | anti-fraud-service | New transaction event |
| `transaction.status` | anti-fraud-service | transaction-service | Fraud validation result |