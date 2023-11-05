# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Solution](#solution)
- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Solution

I have created the next architecture to solve the problem:

```mermaid
  flowchart LR
    User -- Create transaction --> Transaction_API
    Transaction_API -- Create transaction --> Graphql
    Graphql -- store, update, read transactions --> transactionDatabase[(Database)]
    Transaction_API -- Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction_API
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction_API
    Transaction_API -- Update transaction Status event--> Graphql
    Transaction_API -- Read transaction--> Graphql
```

Transaction creation sequence:

```mermaid
  sequenceDiagram
    User->>+Transaction_API: create transaction
    Transaction_API->>+graphql: create transaction
    graphql-->>+database: create transaction in bd
    graphql-->>+Transaction_API: return created transaction
    Transaction_API-->>+kafka: created transaction topic
    kafka-->>+anti-fraud: Validate transaction
    anti-fraud-->>+kafka: reject, approved transaction topic
    kafka-->>+Transaction_API: get data to reject or approve
    Transaction_API-->>+graphql: reject or approve transaction
    graphql-->>+database: Store updated information
```

Transaction read sequence:

```mermaid
sequenceDiagram
    User->>+Transaction_API: read transaction
    Transaction_API->>+graphql: get transaction
    graphql->>+database: find transaction in bd
    graphql-->>+Transaction_API: return transaction
    Transaction_API-->>+User: Transaction
```

## How to run project?

### With docker-compose:

```bash
docker-compose up -d
```

### Individual services:

Remove lines 39-end from docker-compose.yaml

```bash
docker-compose up -d
cd anti-fraud
yarn start:dev
cd graphql
yarn start:dev
cd transactions
yarn start:dev
```

## How test?

Let's use curl for this

**for an approved transaction:**

```bash
curl --location 'http://localhost:5000/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "IdDebit",
    "accountExternalIdCredit": "IdCredit",
    "tranferTypeId": 1,
    "value": 500
}'
```

**for an rejected transaction:**

```bash
curl --location 'http://localhost:5000/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "IdDebit",
    "accountExternalIdCredit": "IdCredit",
    "tranferTypeId": 1,
    "value": 1001
}'
```

You can open `http://localhost:8080` to see kafka descriptions and data

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
