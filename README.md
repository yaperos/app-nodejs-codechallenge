# Yape Code Challenge 🚀

## 📘 Overview

This project was developed following **hexagonal architecture** principles, ensuring a clean separation of concerns to enhance maintainability, scalability, and testing. Solid practices around clean code, OWASP-based security, and modular design were implemented.


## ⚙️ Tech Stack

- **Node.js**: Fully built using NestJS (Node.js framework).
- **REST & GraphQL APIs**: Implemented using GraphQL with potential to extend to REST.
- **GraphQL**: Fully functional with queries and mutations.
- **Design Patterns & Clean Code**: Hexagonal architecture, SOLID principles, DTOs.
- **Kafka**: Full integration with Kafka (Producer & Consumer).
- **Secure & Clean Code**: `class-validator` validations, proper error handling, separation of responsibilities.
- **OWASP Practices**: Input validation, access control, and code injection prevention were considered.
- **Agile Collaboration (optional)**: Modular structure enables teamwork and feature-based development.

## 🔄 Optimization for High Concurrency

The system was designed to handle high-volume scenarios where multiple writes and reads occur simultaneously over the same transaction data. The following optimizations were implemented:

- **Redis Caching**: `Redis` is used to cache transaction query results, significantly reducing database load. Cache entries are automatically invalidated when a transaction status is updated.
- **Database Indexing**: Indexes were applied to key fields (`id`, `accountExternalIdDebit`, `accountExternalIdCredit`, `transactionStatusId`) to speed up read operations.
- **Concurrency Control via Kafka**: The antifraud validation logic was decoupled from the transaction creation flow using Kafka. This allows asynchronous processing and horizontal scalability.


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
```

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