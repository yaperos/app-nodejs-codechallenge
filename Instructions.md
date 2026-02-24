# Financial Transaction System

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Transaction Service                         │
│                                                                  │
│  POST /api/v1/transactions                                       │
│       │                                                          │
│       ▼                                                          │
│  TransactionService.createTransaction()                          │
│       │                                                          │
│       ├── Save Transaction (PENDING) ──────────────► PostgreSQL  │
│       ├── Save OutboxEvent           ──────────────► PostgreSQL  │◄─ Same TX
│       └── Cache Transaction          ──────────────► Redis       │
│                                                                  │
│  OutboxPoller (every 500ms)                                      │
│       └── Read unprocessed events (SKIP LOCKED)                  │
│           └── Publish ─────────────────────────────► Kafka       │
│                                                                  │
│  Kafka Consumer ◄── transaction.status.updated ─────────────────┤
│       └── updateTransactionStatus() (with @Retryable)            │
│           ├── Update DB                                          │
│           └── Refresh Cache                                      │
└─────────────────────────────────────────────────────────────────┘
                              │ Kafka
              transaction.created topic (12 partitions)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Anti-Fraud Service                          │
│                                                                  │
│  Kafka Consumer ◄── transaction.created                          │
│       └── FraudDetectionService.evaluate()                       │
│           ├── AmountThresholdRule (> 1000 → REJECTED)            │
│           └── [extensible: add more rules here]                  │
│                                                                  │
│  Kafka Producer ──► transaction.status.updated                   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Transactional Outbox Pattern

Instead of publishing to Kafka directly inside the DB transaction (which creates a distributed
transaction problem), we write an `outbox_events` record in the same transaction as the domain
data. A background poller reads unprocessed events and publishes them.

**Guarantee:** At-least-once delivery. The service can crash at any point and events will not
be lost. Kafka deduplication (idempotent producer) handles potential duplicate publishes.

### 2. Optimistic Locking (`@Version`)

Each transaction has a `version` column. When two concurrent threads try to update the same
row, Hibernate detects the version mismatch and throws `ObjectOptimisticLockingFailureException`.
`@Retryable` then backs off and retries — ensuring no silent lost updates.

### 3. Cache-Aside Pattern (Redis)

- **Reads:** Check Redis first (< 1ms). On miss, load from PostgreSQL and warm the cache.
- **Writes:** After every status update, refresh the cache immediately.
- **TTL:** 10 minutes — safety net against stale data.
- **Resilience:** Redis failures are caught and logged; the app always falls back to PostgreSQL.

### 4. FOR UPDATE SKIP LOCKED

The outbox poller uses `SELECT ... FOR UPDATE SKIP LOCKED` so multiple service instances
process different batches of events. Without this, all instances would grab the same rows
and publish duplicates.

### 5. Kafka Partitioning Strategy

Both topics use `transactionId` as the message key. This guarantees all events for the same
transaction land on the same partition, preserving ordering per transaction.

### 6. MVC over WebFlux (deliberate choice)

With Kafka decoupling the write path and Redis absorbing reads, the hot path is:

- Write: 20-50ms (DB write + outbox) → thread released immediately
- Read: <1ms (Redis hit)

At 11k concurrent connections with 400 Tomcat threads each freed in ~25ms, theoretical
throughput = 400 × (1000/25) = **16,000 req/sec** — well above requirement.
WebFlux would add complexity without meaningful gain here.

## Running Locally

```bash
# Start all
docker-compose up -d
```

## API Usage

```bash
# Create a transaction (will be PENDING, then auto-evaluated by anti-fraud)
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
    "transferTypeId": 1,
    "value": 500.00
  }'

# Get transaction status
curl http://localhost:8080/api/v1/transactions/{id}

# Watch Kafka topics
open http://localhost:8090  # Kafka UI
```

## High-Volume Tuning Knobs

| Setting              | Value  | Why                                          |
| -------------------- | ------ | -------------------------------------------- |
| Tomcat max threads   | 400    | Handles ~16k req/s with 25ms avg latency     |
| HikariCP pool size   | 20     | Prevents DB connection saturation            |
| Kafka partitions     | 12     | Allows 12 parallel consumers per service     |
| Outbox poll interval | 500ms  | Balances latency vs DB load                  |
| Redis TTL            | 10 min | Prevents stale data without constant DB load |
| JDBC batch size      | 50     | Reduces DB round trips on bulk writes        |
| Kafka linger.ms      | 5      | Micro-batching for better throughput         |
