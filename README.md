# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Yape Code Challenge :rocket:](#yape-code-challenge-rocket)
- [Problem](#problem)
- [Tech Stack](#tech-stack)
  - [Optional](#optional)
- [Send us your challenge](#send-us-your-challenge)
- [Solution](#solution)

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

These are the following steps to run this application:

- Run the command `docker-compose up -d` and wait until all the services started
- 
- Go to `transaction-microservice` folder and install the packages with `yarn install`
- After node module installation finish run the next command: `yarn db:seed`
- Test the service using this command in postman (Accepted value transaction): 
  - `curl --location --request POST 'http://localhost:3000/api/transactions/create' \
--header 'Content-Type: application/json' \
--data-raw '{
  "accountExternalIdDebit": "12345",
  "accountExternalIdCredit": "123456",
  "tranferTypeId": 1,
  "value": 500
}'`
- Test the service using this command in postman (Rejected value transaction): 
  - `curl --location --request POST 'http://localhost:3000/api/transactions/create' \
--header 'Content-Type: application/json' \
--data-raw '{
  "accountExternalIdDebit": "12345",
  "accountExternalIdCredit": "123456",
  "tranferTypeId": 1,
  "value": 1500
}'`
- Then check in postgres db the saved transactions with the next query: 
  
  - `SELECT id, created_at, updated_at, account_external_id_debit, account_external_id_credit, value, "transactionTypeId", "transactionStatusId"
FROM public."transaction" order by id desc`