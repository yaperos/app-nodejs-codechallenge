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




# Solution

In summary, the proposal is based on using GraphQL or an Endpoint as inputs. This allows the solution to be used for various scenarios, taking concurrency into account. When a transaction arrives at the Transaction service, it is inserted into the database with a pending status. Simultaneously, it is sent through a Kafka topic to the Antifraud service. When the Antifraud service obtains the transaction status, it returns to the Transaction service with the correct status and updates it in the database. For queries, Redis is used as a caching mechanism to ensure the database's health.

## Technologies:
- Docker
- GraphQL
- Kafka
- NestJS (TypeScript)
- PostgreSQL
- Prisma
- Zookeeper

## STEPS:

At the beginning, you need to start the containers with

```
docker-compose up
```

After that, we continue with

```
npm run migrations
```

Congrats. Now, we start our project

```
npm run start:dev
```

In this moment you can test the solution through swagger or Graphql


| Playground | Description |
| --- | --- |
| Swagger | 0.0.0.0:8000/api/yape-transactions-ms/doc |
| GraphQL | 0.0.0.0:8000/graphql |


### To GraphQL

```GraphQL
### Create transaction ###
mutation {
  createTransaction(input: {
    accountExternalIdCredit: "b0770c3a-9d32-483c-b1f5-4d0378a72817",
    accountExternalIdDebit: "b0770c3a-9d32-483c-b1f5-4d0378a72816",
    transferTypeId: 1,
    value: 35.50,
  }) {
    status, 
    message
  }
}
```
```GraphQL
### Get transaction ###
mutation {
  getLastTransaction(input: {
    transactionExternalId: "10263a29-2c1a-43f4-bf62-4c03eaef7990"
  }) {
    status, 
    message,
    data{
      transactionExternalId,
      transactionType{
      	name
      },
      transactionStatus{
      	name
      },
      value,
    }
  }
}
```