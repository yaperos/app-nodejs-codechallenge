# HOW TO RUN

Kafka tarda un arrancar, sea paciente por favor 🙏

Todos los servicios estan en el docker compose, para levantar todo el proyecto use:

```
docker-compose up
```

Si desea probar las endpoints puede ejecutar lo siguiente

Para buscar una transacción

```
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"query getTransaction($id: String!){\ngetTransaction(id: $id) {\n    transactionExternalId\n    transactionType\n      transactionStatus\n      value\n      createdAt\n}\n}\n","variables":{"id":"a71a4a5e-43b2-4658-a43a-2b447a3f2a63"}}'
```

Para crear una transacción:

```
curl --location 'http://localhost:3000/graphql' \
--header 'Content-Type: application/json' \
--data '{"query":"mutation createTransaction($transactionRequest: TransactionRequestDto!){\n    createTransaction(transactionRequest: $transactionRequest) {\n        transactionExternalId\n        transactionType\n        transactionStatus\n        value\n        createdAt\n    }\n}","variables":{"transactionRequest":{"accountExternalIdDebit":"57a51cb1-3587-43a9-a352-c52bd3e7606c","accountExternalIdCredit":"0376de90-b11a-445a-8163-d8b5b46c235b","transferTypeId":"1","value":10300}}}'
```


# Yape Code Challenge 🚀

Our code challenge will let you marvel us with your Jedi coding skills 😄.

Don't forget that the proper way to submit your work is to fork the repo and create a PR 😉 ... have fun !!

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
