# Yape Code Challenge :rocket:
# Welcome to My Project!

Hello! I'm Marlon, a passionate software engineer with over 5 years of experience. I've put a lot of effort into this project, but unfortunately,  I've tried my best to deliver a high-quality codebase.

## Project Description

This project is built using a microservices architecture. Here's a brief overview of the server types and services I've implemented:

1. **Transaction Service (Apollo Server)**
   - Running on PORT 4000
   - Utilizing GraphQL
   - Access the GraphQL endpoint at: [http://localhost:4000/graphql](http://localhost:4000/graphql)

2. **Antifraud Service (Express)**
   - Running on PORT 4001 (Note: Not exposed due to security policies)

## Services and Tools Used

I've utilized various services and containers to enhance the functionality of the project:

- **Databases:**
  - Redis
  - Postgres
  - PgAdmin

- **Messaging Systems:**
  - Zookeeper
  - Kafka

- **Management Tools:**
  - KafkaDrop (Access at: [http://localhost:9000](http://localhost:9000))
  - PgAdmin (Access at: [http://localhost:8888](http://localhost:8888))

## Getting Started

To get the project up and running, simply execute the following command:

```bash
docker-compose up
```

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
