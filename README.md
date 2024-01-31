# Yape Code Challenge :rocket:

## Introduction

This project comprises two main microservices - `ms-transaction` and `ms-antifraud`, developed to handle financial transactions with an integrated anti-fraud checking system. The primary objective is to process transactions while ensuring security by validating each transaction for potential fraud.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Kafka**: A distributed streaming platform used for building real-time data pipelines and streaming apps.
- **TypeORM**: An ORM that can run in NodeJS and be used with TypeScript (or JavaScript).
- **PostgreSQL**: An open-source relational database with a focus on standards compliance and extensibility.
- **Docker**: A platform for developing, shipping, and running applications in isolated environments known as containers.

## Architecture Overview

The system is divided into two main microservices:

- **ms-transaction**: Handles creation and retrieval of financial transactions. It sends each transaction to the ms-antifraud for validation.
- **ms-antifraud**: Receives transactions from ms-transaction, performs fraud checks, and sends back the transaction status (approved or rejected).

Both microservices communicate via Kafka, ensuring a decoupled architecture and real-time data processing.

## Running the Project

### Prerequisites:

- Node.js and npm installed.
- PostgreSQL database running.
- Apache Kafka running (can be on Docker or installed locally).

### Steps:

1. Clone the repository to your local machine.
2. Navigate to each microservice directory (`ms-transaction` and `ms-antifraud`).
3. Run `npm install` to install the dependencies.
4. Ensure Kafka and PostgreSQL services are up and running.
5. Configure variables for Kafka brokers, PostgreSQL database credentials.
6. Run `npm start` in each microservice directory to start the services.

