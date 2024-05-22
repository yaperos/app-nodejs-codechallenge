# Yape Code Challenge

## Introduction

This project has been developed using **Nx workspace** for managing a monorepo with multiple microservices based on NestJS. The database used is PostgreSQL with the Prisma ORM for managing migrations and data access. Additionally, Kafka is used as a messaging system.

## Requirements

- Node.js (version 18 or higher)
- Docker (for running PostgreSQL and Kafka)
- `docker-compose` (for orchestrating PostgreSQL and Kafka services)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arodriguezp2003/app-nodejs-codechallenge
   cd app-nodejs-codechallenge
   ```
2. Install the dependencies:
   npm install

## Start Services with Docker Compose

To start the PostgreSQL and Kafka services, run:

```bash
docker-compose up -d
```

Ensure that the containers are running correctly with:
docker ps

## Apply Prisma Migrations

Once the services are up and running, apply the Prisma migrations to set up the database:

```bash
npx prisma migrate deploy
```

## Configuration

Make sure you have a `.env` file at the root of the project with the following variables:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/mydatabase
KAFKA_CLIENT_ID=app-gateway
KAFKA_BROKERS=localhost:9092
KAFKA_CONSUMER_GROUP_ID=kafka-microservices
```

Note: The `.env` file is intentionally configured in development mode.

## Execution

To start the development server, run:

```bash
npx nx serve antifraud-ms
npx nx serve transfers-ms
```

## Build

To build the project for production, run:

```bash
npx nx build antifraud-ms
npx nx build transfers-ms
```

The build artifacts will be stored in the output directory, ready for deployment.

## Testing

To run the tests, use the following command:

```bash
npx nx test antifraud-ms --coverage
npx nx test transfers-ms --coverage
```

## Resources

This project contains Postman files for testing the API endpoints. You can use these files to quickly import the API endpoints into Postman and start testing.

## Contributions

If you wish to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## Contact

For any inquiries or suggestions, please contact [alejandrorodriguezpena@gmail.com](mailto:alejandrorodriguezpena@gmail.com).
