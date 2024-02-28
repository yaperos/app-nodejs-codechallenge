# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Yape Code Challenge :rocket:](#yape-code-challenge-rocket)
- [Problem](#problem)
- [Tech Stack](#tech-stack)
  - [Optional](#optional)
- [Send us your challenge](#send-us-your-challenge)
- [Solution](#solution)
  - [Graph](#graph)
  - [Api GraphQL](#api-graphql)
      - [GetTransaction](#gettransaction)
      - [CreateTransaction](#createtransaction)
      - [UpdateTransaction](#updatetransaction)
- [Set Up project](#set-up-project)
    - [With Docker](#with-docker)
    - [Local](#local)

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
## Graph

![My Image](md_docs/graph-solution.png)

## Api GraphQL

#### GetTransaction

```
POST GetTransaction =>
  http://localhost:3000/graphql
  **Query**
      query getTransaaction($idTransaction: String!){
      getTransaction(input:{
        idTransaction:$idTransaction
      }){
        transactionExternalId
        transactionType{
          name
        }
        transactionStatus{
          name
        }
        createdAt
        value
      }
    }
  **Variables**
  {
    "idTransaction":"e4d03d07-5af7-4678-ac68-3b9c02c724c2"
  }
```

#### CreateTransaction

```
POST GetTransaction =>
  http://localhost:3000/graphql
  **Mutation**
      mutation createTransaction(
        $accountExternalIdDebit: String!
        $accountExternalIdCredit: String!
        $tranferTypeId: Int!
        $value: Int!
        ){
      createTransaction(input: {
        accountExternalIdDebit: $accountExternalIdDebit
        accountExternalIdCredit: $accountExternalIdCredit
        tranferTypeId: $tranferTypeId
        value: $value
      }){
        transactionExternalId
        transactionType{
          name
        }
        transactionStatus{
          name
        }
        createdAt
        value
      }
    }
  **Variables**
  {
    "accountExternalIdDebit": "fd890dcc-cd1b-42bd-937a-7a692fa35e8b",
    "accountExternalIdCredit": "fd890dcc-cd1b-42bd-937a-7a692fa35e8b",
    "tranferTypeId": 2,
    "value": 100
  }
```

#### UpdateTransaction

```
POST UpdateTransaction =>
  http://localhost:3000/graphql
  **Mutation**
  mutation($idTransaction: String!, $status: String!){
      updateTransaction(
          input:{
              idTransaction: $idTransaction,
              status: $status
          }
      ){
          transactionExternalId
          transactionStatus{
            name
          }
      }
  }
  **Variables**
  {
    "idTransaction":"e4d03d07-5af7-4678-ac68-3b9c02c724c2"
  }
```
# Set Up project

### With Docker

```
  > docker compose up -d
```

### Local

> **Note:** Recommendation to install libraries using yarn to avoid problems with library subdependencies
>**Note:**  Use Node 20.*  or higher

```
  > docker compose up -f docker-compose.local.yml -d
  > cd anti_fraud_service
  > yarn install
  > cd ..
  > cd transaction_rest
  > yarn install
  > cd ..
  > npm run start:fraudservice
  > npm run start:transaction
```