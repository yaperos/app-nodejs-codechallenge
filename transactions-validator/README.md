# Transactions Validator  (Anti-fraud Microservice)

This project is a transaction validator service designed with NestJS and Kafka technologies. This service is designed to handle transaction validation based on Kafka messages. It listens to a Kafka topic named transactions_created for incoming messages containing transaction data. Depending on the transaction value, if it exceeds 1000, the microservice updates the transaction status as "rejected"; otherwise, it updates it as "approved." The status update is performed by calling a GraphQL endpoint in another microservice.

## Key Features:


1. Transaction Validation:

     Listens for incoming Kafka messages to validate transactions

2. GraphQL Comunication:

     Utilizes GraphQL to update the status of transactions in another microservice.



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- NestJS
- Kafka


> **_NOTE:_** For your convenience, a Docker Compose file with the necessary containers is included. This allows you to quickly set up and test the system. Refer to the provided Docker Compose file for container configurations.

### Installing

1. Clone the repository

2. Navigate to the project directory:
    ```
    cd transactions-validator
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

1. Ensure transactions-manager Microservice is Running:

    Make sure the transactions-manager microservice is up and running. This microservice is responsible for creating transactions and storing them in the database.

2. Create a Transaction:

    Utilize the functionalities provided by the transactions-manager microservice to create a new transaction. This microservice is expected to expose an endpoint for transaction creation.

    After successfully creating the transaction, transactions-manager should publish it to the Kafka topic transactions_created. This action serves as the trigger for the validation and status update process in the transactions-validator microservice.

3. Validation Process:
    Upon receiving the Kafka message, the transactions-validator microservice validates the transaction based on its value. Transactions with a value greater than 1000 are updated as "rejected," while those with a value equal to or less than 1000 are updated as "approved." The status update is performed through a GraphQL request to another microservice.

> **_NOTE:_** Ensure that the GraphQL server URL are correctly configured in the relevant microservices.

Refer to the documentation of the transactions-manager microservice for detailed information on transaction structure, API endpoints, and other specifics.

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

## Authors

- **Marco Antonio Celaya Ordaz** - *Initial work* - [Marco Celaya - Linkeding](https://github.com/marcocelaya34)

