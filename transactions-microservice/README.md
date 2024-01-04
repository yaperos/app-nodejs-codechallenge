# Transactions Microservice

## Description
This microservice is responsible for creating and querying transactions. To achieve this, it exposes a REST API with the following endpoints:
 - `GET /transactions`: Returns all transactions.
 - `POST /transactions/transfer`: Creates a new transfer between two accounts.

The microservice stores transactions in a PostgreSQL database and publishes events in the `transactions` Kafka topic. Additionally, it subscribes to the `anti-fraud` topic to receive transaction validation events and updates the transaction status in the database accordingly.

## Flow Diagram
```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transact
```

## Execution
### Requirements
To run the microservice, you must have installed:
- Node.js
- npm
- a Kafka service running on port 9092
- a PostgreSQL database running on port 5432, with a newly created database

Also, it's necessary that the Anti-Fraud microservice is running.

### Environment Variables
- `SERVER_NAME`: service name, defaults to `transactions`
- `PORT`: port where the service runs, defaults to `8000`

- `BROKER_CLIENT_ID`: Kafka consumer client id, defaults to `transactions-app`
- `BROKER_GROUP_ID`: Kafka consumer group id, defaults to `transactions-app`
- `BROKER_INITIAL_RETRY_TIME`: initial time to wait before retrying Kafka connection, defaults to `10000`
- `BROKER_TOPIC_TRANSACTIONS`: topic to publish transaction creation events, defaults to `transactions`
- `BROKER_TOPIC_ANTI_FRAUD`: topic to subscribe to transaction validation events, defaults to `anti-fraud`
- `BROKERS`: Kafka brokers to connect to, separated by `,`, defaults to `localhost:9092`

- `POSTGRES_URL`: PostgreSQL database URL, example `postgres://postgres:postgres@localhost:5432/postgres`
- `POSTGRES_PRISMA_URL`: PostgreSQL database URL for Prisma, example `postgres://postgres:postgres@localhost:5432/postgres?pgbouncer=true&connect_timeout=15`

### Installation and Configuration
```
npm install

# Generate Prisma client and set up database
npm run build
```

### Execution
```bash
npm run start
```

### Postman
You can import the Postman collection from `postman/transactions-microservice.postman_collection.json` to test the API.

## Testing
### Execution
```
npm run test
```

### Test Description
#### Integration-Tests - Transactions Service
- Request Transactions API / Status ok


#### Integration-Tests - Transfer
- Request Transactions API / Status ok
- Make a successful transfer
- Make a transfer and get transactionId
- Make a transfer and save with status pending
- Fail transfer with invalid data
- Fail transfer with value 0
- Fail transfer with non-existent transferTypeId

#### Integration-Tests - Get Transaction Info
- Get information of a transaction
- Get information of an invalid transaction
- Get information of a non-existent transaction
- Get information of an approved transaction
- Get information of a rejected transaction