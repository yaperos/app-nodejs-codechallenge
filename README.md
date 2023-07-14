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

# Run Solution

## `make start`

Up project whit docker and docker compose.

Containers:

- postgres (write database).
- mongo (read database).
- kafka (streaming).
- zookeeper
- antifraud-ms.
- transaction-ms.

## `make down`

Remove docker containers.

## Endpoints

### `POST /transactions`

Create new transaction.

Request:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

Response:

```
http status code: 201
```

```json
{}
```

### `GET /transactions/{id}`

Retrieve transaction by id.

Response:

```
http status code: 201
```

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

## GraphQL

### `Playground /graphql`

#### `mutation createTransaction`

Create new transaction.

```graphql
mutation (
  $accountExternalIdDebit: String!,
  $accountExternalIdCredit: String!,
  $transferTypeId: Float!,
  $value: Float!,
) {
  createTransaction(
    accountExternalIdDebit: $accountExternalIdDebit,
    accountExternalIdCredit: $accountExternalIdCredit,
    transferTypeId: $transferTypeId,
    value: $value
  ) {
    transactionExternalId
  }
}
```

#### `query transaction`

Retrieve transaction by id.

```graphql
query ($id: String!) {
  transaction (id: $id) {
    accountExternalIdDebit,
    accountExternalIdCredit,
    transactionExternalId,
    value,
    transactionType {
      name
    },
    transactionStatus {
      name
    },
    createdAt
  }
}
```
