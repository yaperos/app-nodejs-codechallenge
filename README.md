# 🏦 Transaction Processing System (Code Challenge)

This project is a solution to the Yape Code Challenge.

## 📌 Overview

This project implements a simple **event-driven architecture** using Node.js, Kafka, and PostgreSQL.

The system processes financial transactions and validates them through an anti-fraud microservice.

---

## 🧱 Architecture

The solution is composed of two microservices:

* **transaction-service**

  * Creates transactions
  * Stores them in PostgreSQL
  * Publishes events to Kafka
  * Consumes validation results

* **anti-fraud-service**

  * Consumes transaction events
  * Applies validation rules
  * Publishes transaction status updates

---

## 🔄 Flow

1. A transaction is created via API
2. It is stored with status `pending`
3. An event `transaction.created` is sent to Kafka
4. Anti-fraud service consumes the event
5. Applies rule:

   * If value > 1000 → `rejected`
   * Else → `approved`
6. Publishes `transaction.validated`
7. Transaction service consumes and updates status

---

## 🧪 API Endpoints

### ➤ Create Transaction

**POST /transactions**

```json
{
  "accountExternalIdDebit": "string",
  "accountExternalIdCredit": "string",
  "tranferTypeId": 1,
  "value": 120
}
```

**Response:**

```json
{
  "transactionId": "uuid",
  "status": "pending"
}
```

---

### ➤ Get Transaction

**GET /transactions/:id**

**Response:**

```json
{
  "transactionExternalId": "uuid",
  "transactionType": {
    "name": "transfer"
  },
  "transactionStatus": {
    "name": "approved"
  },
  "value": 120,
  "createdAt": "date"
}
```

---

## ⚙️ Tech Stack

* Node.js (NestJS)
* PostgreSQL (Prisma ORM)
* Kafka (KafkaJS)
* Docker

---

## 🚀 How to Run

### 1. Start infrastructure

```bash
docker-compose up -d
```

---

### 2. Run transaction-service

```bash
cd transaction-service
npm install
npm run start:dev
```

---

### 3. Run anti-fraud-service

```bash
cd anti-fraud-service
npm install
npm run start:dev
```

---

## 📡 Kafka Topics

* `transaction.created`
* `transaction.validated`

---

## 🧠 Design Decisions

* Event-driven architecture for decoupling services
* Asynchronous validation to improve scalability
* Prisma ORM for type-safe database access
* Kafka for reliable message delivery

---

## ⚡ Scalability Considerations

To handle high load scenarios:

* Horizontal scaling of consumers (Kafka consumer groups)
* Partitioned topics for parallel processing
* Database indexing on transaction ID
* Potential use of caching (e.g., Redis)

---

## ✅ Status

✔ Transaction creation
✔ Anti-fraud validation
✔ Kafka communication
✔ Transaction status update
✔ Transaction query by ID

---

## 👨‍💻 Author

Christian Pulache
