# Yape Code Challenge — Event-Driven Transaction System

This project implements an **asynchronous transaction processing system** using a microservices architecture and Apache Kafka.

The system validates financial transactions through an anti-fraud service and updates their status asynchronously.

---

## 🧱 Architecture

Two independent microservices communicate using Kafka events:

```
Client → Transaction Service → Kafka → Fraud Service → Kafka → Transaction Service → DB Update
```

### Services

| Service             | Responsibility                                      |
| ------------------- | --------------------------------------------------- |
| transaction-service | Creates transactions and updates their status       |
| fraud-service       | Evaluates fraud rules and returns validation result |

---

## 🔄 Transaction Flow

1. Client creates a transaction → stored as **PENDING**
2. transaction-service publishes `transaction-created`
3. fraud-service consumes and evaluates rule
4. fraud-service publishes `transaction-validated`
5. transaction-service consumes and updates → `APPROVED` or `REJECTED`

---

## 📡 Kafka Topics

| Topic                 | Description                            |
| --------------------- | -------------------------------------- |
| transaction-created   | New transaction event                  |
| transaction-validated | Fraud validation result                |
| *.DLT                 | Dead Letter Topic for invalid messages |

---

## ⚙️ Fraud Rule

Transactions greater than configured value are rejected:

```
fraud.rules.max-amount = 1000
```

---

## 🛡️ Reliability Features

### Idempotent Consumer

The transaction service ignores duplicated validation events.

### Optimistic Locking

`@Version` is used to prevent concurrent updates.

### Poison Message Handling

Invalid messages are redirected to a Dead Letter Topic (DLT) instead of stopping the consumer.

### Decoupled Serialization

Kafka type headers are disabled to avoid coupling services to Java classpaths.

---

## 🚀 Running the Project

### Requirements

* Docker
* Docker Compose

### Start system

```bash
docker compose up --build
```

Services:

* transaction-service → http://localhost:8080
* fraud-service → http://localhost:8081
* kafka → localhost:9092
* postgres → localhost:5433

---

## 🧪 API Usage

### Create Transaction

POST `/transactions`

```json
{
  "accountExternalIdDebit": "11111111-1111-1111-1111-111111111111",
  "accountExternalIdCredit": "22222222-2222-2222-2222-222222222222",
  "transferTypeId": 1,
  "value": 120
}
```

Response (initial):

```json
{
  "transactionExternalId": "uuid",
  "transactionStatus": { "name": "PENDING" }
}
```

After async processing:

```json
{
  "transactionExternalId": "uuid",
  "transactionStatus": { "name": "APPROVED" }
}
```

If value > 1000:

```json
{
  "transactionStatus": { "name": "REJECTED" }
}
```

---

### Get Transaction

GET `/transactions/{transactionExternalId}`

---

## 🔍 Testing DLT

Send invalid message:

```bash
kafka-console-producer --bootstrap-server kafka:9092 --topic transaction-validated
{"transactionExternalId":"abc","status":123}
```

Consume DLT:

```bash
kafka-console-consumer --bootstrap-server kafka:9092 --topic transaction-validated.DLT --from-beginning
```

---

## 🧠 Design Decisions

* Event-driven architecture for loose coupling
* At-least-once processing semantics
* Idempotent consumers to handle retries
* Dead Letter Topic for resilience
* Externalized fraud rules configuration

---

## 📌 Possible Improvements

* Add auditing fields such as updatedAt to track status changes and provide full transaction lifecycle visibility. 
* Outbox Pattern for transactional publishing
* Schema Registry (Avro/Protobuf)
* Retry topics strategy
* Metrics and tracing (OpenTelemetry)

---

## Author

Hans Ponte
