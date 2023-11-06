# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech-stack)
- [Send us your challenge](#send-us-your-challenge)
- [Developer README](#developer-readme)

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

## Developer README

## Installation

```bash
$ npm install
```

## Running the app

```bash
# set the .env with your environment variables
# after that run migrations with the command
$ npm run migrate

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Health Check
```bash
$ curl --location 'localhost:8081/health'
```
### Create Transaction
```bash
$ curl --location 'localhost:8081/transactions/' \
--header 'trace_id: traceId' \
--header 'Content-Type: application/json' \
--data '{
    "transactionExternalId": "5e0133dd-63cb-4022-bf38-cdd56607d33d",
    "accountExternalIdDebit": "2d0d21ed-16fa-47ec-a0c1-fe532644d375",
    "accountExternalIdCredit": "012dd5af-aac1-40fa-b7c2-7e657f44d7cf",
    "tranferTypeId": 1,
    "value": 1000
}'
```
### Get Transaction
```bash
$ curl --location 'localhost:8081/transactions/5e0133dd-63cb-4022-bf38-cdd56607d33d' \
--header 'trace_id: traceId'
```

### Transactions External ID Examples
```bash
7d800dda-9d23-4574-a4b1-7eee56245987
de7faa9e-e210-4f87-9051-b0d2849aa73f
c27ac3cb-7f08-4dc2-9ffc-fb6efdb2da4d
```
You can generate more IDs on [Online UUID Generator](https://www.uuidgenerator.net/version4)

### Made with Love :hearts:
- by Stephen Cataño | Backend Engineer | [LinkedIn](https://www.linkedin.com/in/stephen-catano/) & [GitHub](https://github.com/stephencatano)

#### Using
- [Nest.js](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Kafka](https://kafka.apache.org/)
- [Jest](https://jestjs.io/)