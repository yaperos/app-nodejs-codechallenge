
# Microservice antifraud

The project is an application that facilitates the integration and management of financial transactions. Core functionality includes:

- **Evaluates transactions**: Allows you to evaluate and return a status for the transaction coming from a Kafka queue.
  
- **Integration with MS-Transaction**: After receiving the transactions and evaluating them, transactions are sent to the microservice via Kafka.

## Requirements before starting
- **Nodejs v21**
- **Kafka**
- **PostgreSQL**

## Dependencies
- Run the main docker-comopse to run: postgresql and kafka
`docker compose up --build -d`

## Installation

#### Packet installation
```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

