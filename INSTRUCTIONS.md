# SOLUTION:

Technology Stack: 
  - NestJS
  - TypeORM
  - Kafka
  - GraphQL
  - Postgres

# Instructions:
1. [Install Docker Compose](https://docs.docker.com/compose/install/)
1. Run all containers with `docker-compose up`
1. The Application can be tested using the graphql Enpoint `http://localhost:3000/graphql`
  - Create new transaction:
    ```graphql
    mutation {
      createTransaction(createTransactionInput:{
        accountExternalIdDebit: "6996e264-06de-4ec1-8319-ad8fdb81c8c1"
        accountExternalIdCredit: "d0146164-0fc2-413f-99ad-1bd33707b25b"
        tranferTypeId: 1
        value: 1000
      }){
        transactionExternalId
        accountExternalIdDebit
        accountExternalIdCredit
        transactionStatus {
          name
        }
        value
        transactionType {
          name
        }
        createdAt
      }
    }
    ```
  - For consult the existing transactions:
    ```graphql
    query {
      transactions{
        transactionExternalId
        accountExternalIdDebit
        accountExternalIdCredit
        value
        transactionStatus {
          name
        }
        transactionType {
          name
        }
        createdAt
      }
    }
    ```
  - For consult single transaction using `TRANSACTION_ID`:
    ```graphql
    query {
      transaction (transactionId: "TRANSACTION_ID")
        transactionExternalId
        accountExternalIdDebit
        accountExternalIdCredit
        value
        transactionStatus {
          name
        }
        transactionType {
          name
        }
        createdAt
      }
    }
    ```
4. Also we can test using curl commands:
  - Create single transaction
    ```sh
    curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"mutation {\n  createTransaction(createTransactionInput:{\n    accountExternalIdDebit: \"6996e264-06de-4ec1-8319-ad8fdb81c8c1\"\n    accountExternalIdCredit: \"d0146164-0fc2-413f-99ad-1bd33707b25b\"\n    tranferTypeId: 1\n    value: 1000\n  }){\n    transactionExternalId\n    accountExternalIdDebit\n    accountExternalIdCredit\n    transactionStatus {\n      name\n    }\n    value\n    transactionType {\n      name\n    }\n    createdAt\n  }\n}"}' --compressed
    ```
  - Get all transactions:
    ```sh
    curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"query {\n  transactions {\n    transactionExternalId\n    accountExternalIdDebit\n    accountExternalIdCredit\n    value\n    transactionStatus {\n      name\n    }\n    transactionType {\n      name\n    }\n    createdAt\n  }\n}"}' --compressed
    ```
