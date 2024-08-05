# Yape Code Challenge 

## Problem

 [Problem](README2.md)

## Solution Description

Proposed event-based solution with clean architecture. The solution addresses high-volume situations where there is a large number of writes and reads.

## Technologies

<ul>
  <li>NestJS</li>
  <li>GraphQL</li>
  <li>TypeORM</li>
  <li>Mongoose</li>  
  <li>CQRS</li>  
  <li>Saga</li>
  <li>MongoDB</li>
  <li>PostgreSQL</li>
  <li>Kafka</li>
  <li>Docker</li>
</ul>

## Docker compose
docker-compose -f docker-compose.yml -p solyape up -d 

## Migrations - run them in apps/transaction-write
npm run migration:generate:transaction apps/transaction-write/src/transaction/infrastructure/database/migrations/inicio

npm run migration:run:transaction

npm run seed:run:transaction

### optional
npm run migration:revert


## Variables de Entorno

### file `.env`

```plaintext
NODE_ENV=development

TRANSACTION_WRITE_CLIENT=transaction-write
TRANSACTION_WRITE_CONSUMER=transactionwrite-consumer

TRANSACTION_READ_CLIENT=transaction-read
TRANSACTION_READ_CONSUMER=transactionread-consumer

ANTIFRAUD_CLIENT=antifraud-write
ANTIFRAUD_CONSUMER=antifraud-consumer

BROKERS=localhost:29092        

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=yape
POSTGRES_USER=userapp
POSTGRES_PASSWORD=yape$

MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=yaperead
MONGODB_USER=root
MONGODB_PASS=pwd2024
```

### Start the microservices

```bash
npm run start:dev transaction-read

npm run start:dev transaction-write
  
npm run start:dev antifraud
```


## Test graphql
 
To create a transaction

http://localhost:3000/graphql

```graphql
mutation {
  createTransaction(
    createTransactionRequest: {
      accountExternalIdDebit: "a81bc81b-dead-4e5d-abff-90865d1e13b1"
      accountExternalIdCredit: "a81bc81b-dead-4e5d-abff-90865d1e13b1"
      tranferTypeId: 1
      value: 840
    }
  ) {
    transactionExternalId
  }
}
```

To view all transactions by filters

http://localhost:3001/graphql


```graphql
query {
  searchTransactions(searchTransactionRequest: {
    transactionExternalId: "",
    transactionType: { name: "" },
    transactionStatus: { name: "" },
    value: 0,
    createdAt: null
  }) {
    transactionExternalId
    transactionType
    accountExternalIdDebit
    accountExternalIdCredit
    transactionStatus
    value
    createdAt
  }
} 
```