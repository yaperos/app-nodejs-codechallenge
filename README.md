# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:.

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same
service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    TransactionEntity -- Save TransactionEntity with pending Status --> transactionDatabase[(Database)]
    TransactionEntity --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> TransactionEntity
    Anti-Fraud -- Send transaction Status Rejected event--> TransactionEntity
    TransactionEntity -- Update transaction Status event--> transactionDatabase[(Database)]
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

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios
where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this
requirement?

You can use Graphql;

## Routes for testing

- Create Transaction
    - Request

```
curl --location 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--data '{
"accountExternalIdDebit": "ffb3c960-3ca7-47cd-8591-e24a13a95ccc",
"accountExternalIdCredit": "ffb3c960-3ca7-47cd-8591-e24a13a95ccb",
"tranferTypeId": 1,
"value": 150.25
}'
```

- Response

```
{
    "status": true,
    "data": {
        "transactionExternalId": "e9bacc00-90c4-4ea8-8899-97627f5f6201",
        "transactionStatus": {
            "name": "pending"
        },
        "transactionType": {
            "name": "incoming"
        },
        "value": 150.25,
        "createdAt": "2024-01-29T12:31:29.504Z"
    },
    "message": "Transaction created successfully"
}
```

- Get Transaction
    - Request

```
curl --location 'http://localhost:3000/transactions/{transactionExternalId}' \
--header 'Content-Type: application/json
```

-Response

```
    "status": true,
    "data": {
        "transactionExternalId": "e9bacc00-90c4-4ea8-8899-97627f5f6201",
        "transactionStatus": {
            "name": "approved"
        },
        "transactionType": {
            "name": "incoming"
        },
        "value": 150.25,
        "createdAt": "2024-01-29T12:31:29.504Z"
    }
}
```

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios
where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this
requirement? Redis used for cache.

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There
are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you
feel is the most appropriate solution.

If you have any questions, please let us know.
