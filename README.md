# Used technology
<ol>
  <li>NodeJS</li>
  <li>Express</li>
  <li>Apache Kafka</li>
  <li>mongoose</li>
  <li>MongoDB</li> 
</ol>

# Start microservices
1. Go to the transaction and antifraud folders execute the command "npm start" to run microservice.
Kafka to running before starting services.

# EndPoints
1. Create a transaction
POST: http://localhost:3800/api/transactions
```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 965
}
```

2. Retrieve a transaction
POST: http://localhost:3800/api/transactionsRetrieve
```json
{
  "transactionExternalId": "435dd7ab-64cf-4574-960b-1211378e0e6b",
  "transactionType": "normal",
  "transactionStatus": "",
  "value": 965,
  "createdAt": "2023-06-23T00:00:00.000+00:00"
}
```

3. Update status transaction
PUT: http://localhost:3800/api/update/{transactionExternalId}
```json
{
    "estadoTransaccion": "approved"
}
```

# Services process

                    +------------------+      +------------------+
                    |                  |      |                  |
                    |   Transaction    |      |    Antifraud     |
                    |     Service      |      |     Service      |
                    |                  |      |                  |
                    +---------+--------+      +--------+---------+
                              |                        |
                    +---------+--------+      +--------+---------+
                    |                  |      |                  |
                    |       Kafka      |      |       Kafka      |
                    |                  |      |                  |
                    +---------+--------+      +--------+---------+
                              |                        |
                    +---------+--------+      +--------+---------+      +--------+---------+
                    |                  |      |                  |      |		   |
                    |    Antifraud     |      |    Transaction   |   -  |		   |
                    |     Service      |      |     Service      |      |     MongoDB	   |
                    |                  |      |           	 |      |		   |
                    +------------------+      +------------------+      +------------------+
					

# Data Base name and Collection name
financial.transactions

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

