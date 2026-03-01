# Yape Code Challenge

This microservice handles the management of financial transactions, integrating asynchronous anti-fraud validation through an event-driven flow. The solution has been designed with a pragmatic and scalable approach, prioritizing data consistency and high performance in service-to-service communication.

## Tech Stack
* **Java 17 / Spring Boot 4.0.3**: Leveraging the latest performance improvements.
* **GraphQL (Spring GraphQL)**: For a flexible and optimized API that prevents over-fetching.
* **PostgreSQL 14**: Robust relational persistence.
* **Apache Kafka**: Event bus for asynchronous and decoupled communication.
* **MapStruct**: High-performance object mapping (based on code generation, not reflection).
* **Docker & Docker Compose**: Complete infrastructure orchestration.

---

## Engineering & Design Decisions

### 1. Pragmatic Layered Architecture
A clear separation between `Controller`, `Service`, and `Repository` was implemented.
* **Justification:** For this specific domain, priority was given to reducing latency and code simplicity (KISS), avoiding excessive boilerplate while maintaining solid decoupling through Mappers and DTOs.

### 2. Distributed Identity (Native UUID)
The `Transaction` entity uses a **UUID** as a natively generated primary key.
* **Scalability:** As a system designed for **High Volume**, using UUIDs avoids database contention caused by traditional sequences and facilitates future horizontal scaling.
* **Data Type:** The native Postgres UUID type is used to optimize storage and indexing.

### 3. Persistence & Event Strategy
* **Atomicity:** `saveAndFlush` is used in the service to ensure the transaction is physically persisted before emitting the Kafka event.
* **Asynchrony:** The main flow is non-blocking. The transaction is created in a `PENDING` state, and the final state (`APPROVED`/`REJECTED`) is updated eventually by the Kafka consumer.

---

## How to Run the Project

### Prerequisites
* Docker and Docker Compose installed.

### Steps
1. **Start infrastructure and microservices:**
   From the repository root, run:
   ```bash
   docker-compose up --build -d
   ```
   *This command will spin up PostgreSQL, Kafka, Zookeeper, the Transaction Service, and the Anti-fraud Service.*

---

## API Reference (GraphQL)

### Create Transaction (Mutation)
```graphql
mutation {
  createTransaction(request: {
    accountExternalIdDebit: "550e8400-e29b-41d4-a716-446655440000",
    accountExternalIdCredit: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    transferTypeId: 1,
    value: 120.50
  }) {
    transactionExternalId
    transactionStatus {
      name
    }
    createdAt
  }
}
```

### Get Transaction (Query)
```graphql
query {
  getTransaction(id: "YOUR_TRANSACTION_UUID") {
    transactionExternalId
    value
    transactionStatus {
      name
    }
    transactionType {
      name
    }
    createdAt
  }
}
```