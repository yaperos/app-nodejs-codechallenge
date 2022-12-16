# Yape Code Challenge :rocket:

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
  "transferTypeId": 1,
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

When you finish your challenge, after forking a repository, you can open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.


# Code
* Use of CLEAN ARCHITECTURE
* Layout or packaging
  * adapter
    * input
      * messaging
      * web
        * dto
        * converter
    * output
      * messaging
      * db
  * application
  * domain  
    * models
    * usecases
* Multiple commits following a step-by-step logical construction of the conceptual sequence diagram
  (so there is no magic one-shot commit) In this sense, the project can be used as a tool for teaching to newcomers.
  * transaction
    * clean architecture skeleton
    * creation endpoint
    * db repository, saving of transaction
    * messaging producer
    * notify antifraud to check transaction
  * antifraud
    * clean architecture skeleton
    * messaging consumer
    * consume event
    * validate transaction
    * messaging producer
    * notify transaction with validation result
  * transaction
    * messaging consumer
    * db repository, update of transaction using optimistic concurrency
    * update transaction in accordance to validation result

# Advantages of CLEAN ARCHITECTURE
* Separate domain from infrastructure, technology
* Understanding WHAT the system does by looking at its usecases
* Have a big picture of the architecture,
  participants, dependencies, kind of context diagram
* Maintenability, evolvability, readbility, comprehensibility (mainly by newcomers)
* Structure not imposed by frameworks and so resilient to framework changes.
* Currently used by Yape on Java code

# Design
* For tackling a huge amount of writes and read:
  Usage of optimistic concurrency. Advantage: no need of a database transaction for the
  resource update.

# Technical notes
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up

psql -U postgres -p 5434 -h localhost -W
psql -U postgres -p 5434 -h localhost -d transaction_db  -W

# Notes to organize
* Code formatted with ESLint
* Sequence of commits (tool of teaching)