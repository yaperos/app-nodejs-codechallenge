# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# Running on local
Rename .env.example to .env

```sh
docker-compose up --build
```

## Queries and mutation
POST https://localhost:3000/graphql

* Create a transaction
```graphql
mutation($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    success message 
    transaction {
      transactionExternalId value createdAt updatedAt transactionStatus { name }
      transactionType { name }
    }
  }
}
```
Variables
```json
{
  "input": {
    "accountExternalIdDebit": "QWNjb3VudEV4dGVybmFsSWREZWJpdDpkM2U0MTViYS0yNmZiLTRhNGUtYTY2Mi03MzY1Nzc3MmE0ZWE=",
    "accountExternalIdCredit": "QWNjb3VudEV4dGVybmFsSWRDcmVkaXQ6M2ZmMTQ3NjEtZGRmOC00Y2RlLTg4MjQtMjc0MDgxM2IxYzg5",
    "tranferTypeId": "VHJhbnNhY3Rpb25UeXBlOjE=",
    "value": 120
  }
}
```

* List transactions
```graphql
query {
  transactions(first: 20) {
    transactionExternalId transactionType { name } transactionStatus { name }
    value createdAt
  }
}
```

* Get a transaction by id
```graphql
query {
  transaction(id: "VHJhbnNhY3Rpb246MGMzNzZmZWItNzM2Yi00NzM3LTkzYmUtMTgyNTI5Yjk0Mzlm") {
    transactionExternalId transactionType { name } transactionStatus { name }
    value createdAt
  }
}
``````
