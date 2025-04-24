# Yape Code Challenge 🚀

## 📘 Overview

This project was developed following **hexagonal architecture** principles, ensuring a clean separation of concerns to enhance maintainability, scalability, and testing. Solid practices around clean code, OWASP-based security, and modular design were implemented.

## 🔁 How It Works

- User creates a transaction (status: `pending`)
- Event is emitted to Kafka (`transaction_created`)
- Antifraud microservice listens and validates:
   - If value > 1000 → `rejected`
   - Else → `approved`
- Status is updated in DB and cache is invalidated


## ⚙️ Tech Stack

- **Node.js**  
  Developed entirely using the NestJS framework for robust, scalable architecture.

- **Design Patterns & Clean Code**  
  Follows Hexagonal Architecture, SOLID principles, and uses DTOs for structured data flow.

- **GraphQL & REST Support**  
  API layer implemented with GraphQL, with potential for REST extensions.

- **Kafka Integration**  
  Implements both Producer and Consumer logic for asynchronous antifraud processing.

- **Redis Caching**  
  Used to cache transaction queries and reduce database load, with auto-invalidation on updates.

- **Kafka UI**  
  Web-based interface to visualize topics, messages, and consumers for Kafka.

- **Secure and Maintainable Code**  
  Input validation with `class-validator`, comprehensive error handling, and clear separation of concerns.

- **OWASP Security Practices**  
  Focus on preventing injection attacks, validating user input, and enforcing access control.

- **Basic Authentication (API)**  
  All GraphQL requests are protected using **Basic Auth**. This is simple and secure for demo purposes, but could be upgraded to **OAuth2 or JWT** for production environments.

- **Unit Testing**  
  Unit tests were added for core use cases, resolvers, and services, enabling logic validation and regression detection.

- **Code Documentation**  
  The codebase is documented with clear comments and structure to improve readability and maintainability.

## 🚀 Improvements for High Concurrency and Performance

The system was designed to handle high-volume scenarios where multiple writes and reads occur simultaneously over the same transaction data. The following optimizations were implemented:

- **Redis Caching**  
  Redis is used to cache transaction query results, significantly reducing database load. Cache entries are automatically invalidated when a transaction status is updated.

- **Database Indexing**  
  Indexes were applied to key fields (`id`, `accountExternalIdDebit`, `accountExternalIdCredit`, `transactionStatusId`) to speed up read operations.

- **Concurrency Control via Kafka**  
  The antifraud validation logic was decoupled from the transaction creation flow using Kafka. This allows asynchronous processing and horizontal scalability.


## 📁 Project Structure

```bash
src/
├── modules/
│   └── transaction/
│       ├── application/
│       │   └── use-cases/
│       │       ├── create-transaction.use-case.ts
│       │       ├── find-transaction.use-case.ts
│       │       └── update-transaction.use-case.ts
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── transaction.entity.ts
│       │   │   └── transaction.types.ts
│       │   └── repositories/
│       │       └── transaction.repository.ts
│       ├── infrastructure/
│       │   ├── graphql/
│       │   │   ├── dto/
│       │   │   │   ├── create-transaction.input.ts
│       │   │   │   ├── transaction.output.ts
│       │   │   │   └── transaction.mapper.ts
│       │   │   ├── filters/
│       │   │   │   └── graphql-exception.filter.ts
│       │   │   └── transaction.resolver.ts
│       │   ├── kafka/
│       │   │   ├── antifraud.consumer.ts
│       │   │   └── antifraud.producer.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   ├── prisma.service.ts
│       │   │   └── transaction.repository.impl.ts
│       │   └── redis/
│       │       └── redis.service.ts
│       └── transaction.module.ts
├── app.module.ts
├── main.ts
tests/
├── transaction/
│   ├── create-transaction.use-case.spec.ts
│   ├── find-transaction.use-case.spec.ts
│   ├── transaction.resolver.spec.ts
│   └── update-transaction.use-case.spec.ts
prisma/
├── schema.prisma
├── seed.ts

```

## 🛠 Developer Notes

- `@/` path alias configured via `tsconfig-paths`
- Prisma client compiled with Linux binary target for Docker compatibility
- CSRF protection enabled in production mode
---

## 🌍 Sandbox URL

🔗 **[https://app-nodejs-codechallenge.mnkyng.com/graphql](https://app-nodejs-codechallenge.mnkyng.com/graphql)**

### 🔐 Authentication

- **Username**: `codechallenge`
- **Password**: `codechallenge`

#### HTTP HEADERS
```json
{
  "Authorization": "Basic Y29kZWNoYWxsZW5nZTpjb2RlY2hhbGxlbmdl"
}
```

![GraphQL Playground](./images/graphql-playground.png)

---

## 🧪 Example Queries

### Create a Transaction

```graphql
mutation {
  createTransactionMutation(input: {
    accountExternalIdDebit: "f0f1c7fe-83aa-4e5e-a4bb-4cf9fd2f1111",
    accountExternalIdCredit: "aaa0f719-5048-46c6-b8b0-6fa2d13f0088",
    transferTypeId: 1,
    value: 1001
  }) {
    transactionExternalId
    value
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    createdAt
  }
}
```

### Get a Transaction

```graphql
query {
  getTransaction(id: "a7e64485-e66a-4899-8ba7-d52859c6c042") {
    transactionExternalId
    value
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    createdAt
  }
}
```

---

## 🛠️ Local Setup

### Step 1: Create the database and schema manually

```sql
CREATE DATABASE sandbox_db;
\c sandbox_db
CREATE SCHEMA yape_challenge;
```

### Step 2: Start services with Docker

```bash
docker-compose up -d
```

_This will start PostgreSQL, Kafka, Zookeeper, and Redis._

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Set up the database

```bash
npm run db:setup
```
### Step 5: Set Up environment variables

Add these variables to a `.env` file in your root directory:

```env
DATABASE_URL="postgresql://sandbox_user:sandbox_password@localhost:5432/sandbox_db?schema=yape_challenge"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL_SECONDS=60
KAFKA_BROKER=localhost:9092
ANTIFRAUD_REJECT_LIMIT=1000
```

### Step 6: Start the development server

```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000/graphql`

---

## 🐳 Docker Deployment (Portainer)

This project can also be deployed and managed easily using [**Portainer**](https://www.portainer.io/), a friendly web interface for Docker.

### Successful Deployment Example

Below is a screenshot of the Portainer environment showing all required services (`PostgreSQL`, `Kafka`, `Zookeeper`, `Redis`, and the `API`) running successfully:

![Portainer Containers Running](./images/portainer-containers.png)

---
## 📊 Kafka Visualization

You can also monitor Kafka traffic via the integrated Kafka UI.

🔗 **[https://app-kafkaui-codechallenge.mnkyng.com/](https://app-kafkaui-codechallenge.mnkyng.com/)**

**Authentication:**
- **Username**: `codechallenge`
- **Password**: `codechallenge`

![Kafka UI](./images/kafka-ui-dashboard.png)