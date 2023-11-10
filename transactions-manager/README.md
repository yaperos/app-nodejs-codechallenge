# Transactions Manager

This project is a transaction management service designed with NestJS, GraphQL and Kafka technologies. This service provides users with a comprehensive set of functionalities for efficient transaction manipulation. 

## Key Features:


1. Transaction Creation:

    Allows users to create new transactions by providing details such as accountExternalIdDebit, accountExternalIdCredit, tranferTypeId and value

    Transactions are sent to the Antifraud microservice through Kafka for additional processing in which it is validated if the transaction will be rejected or accepted.

2. Transaction Update:

    Facilitates the update of transaction-related information, ensuring the accuracy and consistency of stored data.

3. Transaction Query:

    Provides powerful queries that allow users to retrieve specific information about all transactions or a specific one using UUID.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- NestJS
- Kafka
- PostgreSQL (`with a DB created based on the environment variable POSTGRES_DB`)

> **_NOTE:_** For your convenience, a Docker Compose file with the necessary containers is included. This allows you to quickly set up and test the system. Refer to the provided Docker Compose file for container configurations.

### Installing

1. Clone the repository

2. Navigate to the project directory:

    ```
    cd transactions-manager
    ```

3. Install the dependencies
    ```
    npm install
    ```

4. Configure environment variables.

     Copy the `.env.example` file to `.env` and fill in your own settings:

5. Start the application
    ```
    npm run start
    ```

## How to Use

### Transaction Creation:

Use the GraphQL endpoint `http://{yourhost}:{yourport}/graphql` to send requests for creating new transactions, providing the necessary parameters.


```
mutation {
  createTransaction(
    createTransactionDTO: {
      accountExternalIdDebit: "Guid"
      accountExternalIdCredit: "Guid"
      tranferTypeId: 1
      value: 1000
    }
  ) {
    value
  }
}
```

### Transaction Update:
Through the GraphQL endpoint `http://{yourhost}:{yourport}/graphql`, you can update an existing transaction by providing the details to modify.

```
mutation {
  updateTransaction(
    updateTransactionDTO: {
      uuid: "{yourUUID}"
      transactionStatus: { name: APPROVED }
    }
  )
}
```

### Transaction Query:
Perform specific queries to retrieve information about transactions based on UUID.

```
query {
  getOneTransaction(uuid: "{yourUUID}") {
    uuid
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    value
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    createdAt
    updatedAt
  }
}
```

Perform queries to retrieve information about all transactions.

```
query {
  getTransactions {
    uuid
    accountExternalIdDebit
    accountExternalIdCredit
    tranferTypeId
    value
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    createdAt
    updatedAt
  }
}
```

## Running the tests

Run the tests using the following command:
```
npm run test
```

## Running the coverage

Run the tests coverage using the following command:
```
npm run test:cov
```

## Built With

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Kafka](https://kafka.apache.org/) - An open-source distributed event streaming platform.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open source object-relational database system.

## Authors

- **Marco Antonio Celaya Ordaz** - *Initial work* - [Marco Celaya - Linkeding](https://github.com/marcocelaya34)

