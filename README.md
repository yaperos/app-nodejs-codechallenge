# Financial Transaction and Anti-Fraud Microservices

This repository contains two microservices: the Transaction Microservice and the Anti-Fraud Microservice. The Transaction Microservice is responsible for handling financial transactions, while the Anti-Fraud Microservice validates these transactions.

## Setting up the project

1. Run the docker-compose file to start the microservices and their dependencies.
2. The GraphQL API will be available at `http://localhost:4000/graphql`.

## Transaction Microservice

The Transaction Microservice is responsible for creating and retrieving financial transactions. It exposes a GraphQL API for creating transactions and retrieving transaction details.

### Using the Transaction Microservice

To create a transaction, you can send a GraphQL mutation to the Transaction Microservice. For example:

```graphql
mutation {
  createTransaction(
    accountExternalIdDebit: "12345",
    accountExternalIdCredit: "67890",
    transactionType: "1",
    value: 120
  ) {
    transactionExternalId
    accountExternalIdDebit
    accountExternalIdCredit
    value
    transactionStatus
    createdAt
  }
}
```

To retrieve a transaction, you can send a GraphQL query:

```graphql
query {
  getTransaction(transactionExternalId: "transaction-id") {
    accountExternalIdCredit
    accountExternalIdDebit
    createdAt
    transactionExternalId
    transactionStatus
    transactionType
    value
  }
}
```

## Anti-Fraud Microservice
The Anti-Fraud Microservice is responsible for validating financial transactions created by the Transaction Microservice. If a transaction has a value greater than 1000, it will be rejected; otherwise, it will be approved.

## Integration
The Anti-Fraud Microservice is integrated with the Transaction Microservice through Kafka. When a transaction is created, the Transaction Microservice sends a message to a Kafka topic. The Anti-Fraud Microservice listens to this topic, validates the transaction, and updates the transaction status accordingly.

## Testing the Microservices Together
Ensure both microservices are running.

Create a transaction using the Transaction Microservice's GraphQL API.

Check the transaction details to see if the status has been updated based on the validation performed by the Anti-Fraud Microservice.