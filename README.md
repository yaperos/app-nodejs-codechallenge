# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Getting Started](#getting-started)
- [Testing Endpoints](#testing-endpoints)
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

## Getting Started

To initialize your development environment, run:

```bash
docker-compose up
```
This command will start all the necessary services.

## Testing Endpoints

Once the services are running, you can test the transaction functionality.

**Creating a Transaction**

POST to `http://localhost:3002/transactions` with the following payload:

```json
{
  "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174000",
  "accountExternalIdCredit": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "transferTypeId": 1,
  "value": 123
}
```

You should receive a response like:

```json
{
  "transactionExternalId": "609373d2-d8f8-4965-aa90-aeea5289c1af",
  "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174000",
  "accountExternalIdCredit": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "value": 123,
  "createdAt": "2024-01-20T14:41:31.931Z",
  "transferType": { "name": "Tipo1" },
  "transactionStatus": { "name": "pending" }
}
```

**Retrieving a Transaction**
GET `http://localhost:3002/transactions/609373d2-d8f8-4965-aa90-aeea5289c1af` to retrieve the transaction details. The response will be:

```json
{
  "transactionExternalId": "609373d2-d8f8-4965-aa90-aeea5289c1af",
  "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174000",
  "accountExternalIdCredit": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "value": "123.00",
  "createdAt": "2024-01-20T14:41:31.931Z",
  "transferType": { "name": "Tipo1" },
  "transactionStatus": { "name": "approved" }
}
```


## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.
