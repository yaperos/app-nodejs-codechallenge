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

## Run

- Docker
    
      $ docker-compose up

- MS Transaction 

      $ cd ms-transaction 
      $ npm i (node v14.21.1 / npm v7.24.2)
      $ npm run migrations:run
      $ npm run start:dev

- MS Anti Fraud

      $ cd ms-anti-fraud 
      $ npm i (node v14.21.1 / npm v7.24.2)
      $ npm run start:dev


## Test Graphql

[http://localhost:3000/graphql](http://localhost:3000/graphql)

    1. Create transaction

```json
    mutation{
      createTransaction(data:{
        accountExternalIdDebit:"587a8c64-d96f-11ed-afa1-0242ac120002",
        accountExternalIdCredit:"650a0766-d96f-11ed-afa1-0242ac120002",
        tranferTypeId: 1,
        value: 1000
      }){
        transactionExternalId,
        transactionType{
          name
        },
        transactionStatus{
          name
        },
        value,
        createdAt
      }
    }
```

![alt text](./readme/POST.png)

    2. Get transaction

```json
    {
      getTransaction(id:"01cbce82-5a1c-40d7-a500-c7d4d7936cab"){
        transactionExternalId
        transactionType{
          name
        }
        transactionStatus{
          name
        }
        value
        createdAt
      }
    }
```
![alt text](./readme/GET.png)

## Test Services

1. Create transaction: http://localhost:3000/transactions/create

    1.1.  Create transaction >> request/response

      ![alt text](./readme/POST2.png)


2. Retrieve transaction (GET): http://localhost:3000/transactions/transactionExternalID

    2.1.  Retrieve transaction >> request/reponse

      ![alt text](./readme/GET2.png)