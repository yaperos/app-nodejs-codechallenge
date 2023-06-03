# Yape Code Challenge :rocket:
Renato Chavez Urday
## Tech stack

- **Nest JS**: for the transaction API and the antifraud service.
- **GraphQL** for the API in the transaction API.
- **Apache Kafka**: to send messages between the transaction API and the anti fraud service. Also to queue database write operations in the transaction API.
- **PostgreSQL**: as database.

## Description

There are two Nest JS projects, the transaction API (an API to create and get transactions data) and the anti fraud service (which verifies if a transaction should be approved or denied).

We use kafka for:
- Both services interact using Kafka to verify and update the status of transactions. On transaction creation the transaction API sends a message with the transaction data to Kafka. The antifraud service consume the created message and sends a new message with the updated transaction status. The transaction API will consume the last message and update the transaction status in DB.
- We also use Kafka inside the transaction API, to queue database write operations (approach to store transaction data and reduce the load on database). We use the transaction transactionExternalId (since is unique) for the message key, which is important to keep the create/update messages in the same partition and maintain messages order.

Also, the transaction API uses GraphQL for transaction creation and to retrieve transaction data.

## Run the project

##### 1. Run the project with docker compose, and wait for the transaction-api and antifraud-service to be deployed.

```sh
$ docker-compose build
$ docker-compose up
```

##### 2. Go to the GraphQL Playground ([http://localhost:3001/graphql](http://localhost:3001/graphql))


##### 3. Example of GraphQL mutation to create a new transaction

```sh
mutation {
  addTransaction(
    transactionData: {
      accountExternalIdDebit: "36afe91c-c59c-453c-b671-2c6cefa9c113"
      accountExternalIdCredit: "47295f84-f2a3-43ff-92e3-9a72c59a8b05"
      transferTypeId: 1
      value: 999
    }
  ) {
    transactionExternalId
    status
  }
}
```

##### 4. Example of GraphQL query to retrieve transaction data

```sh
query {
  transaction(transactionExternalId: "TRANSACTION_EXTERNAL_ID") {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```

### Problems and limitations

A problem about the approach used to store transaction data in the database would be that on transaction creation, we are sending a message to Kafka to create a new transaction. The problem is that if we try to use the retrieve transaction resource before the created transaction message is consumed, it would return 404, since the transaction  is not created yet in the database. A workaround would be to use a listener for the kafka message or a listener to verify if the transaction was created in the database, that listener should be added in the creation endpoint, depending on the product requirements.
