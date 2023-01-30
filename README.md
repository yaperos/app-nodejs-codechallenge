# Yape-Code-Challenge
### Tech Stack:

[![NestJS][NestJS]][NestJS-url] [![Typescript][Typescript]][Typescript-url] [![GraphQL][GraphQL]][GraphQL-url] [![Prisma][Prisma]][Prisma-url] [![Postgres][Postgres]][Postgres-url] [![Kafka][Kafka]][Kafka-url] [![Docker][Docker]][Docker-url]


## Main Setup

1. Root directory contains a `docker-compose.yml` file. Run `docker-compose up -d` to create docker containers in detached mode.

## TRANSACTION MANAGER Microservice Setup

1. Go to directory `transaction-manager-microservice`
2. Run `npm i` to install dependencies.
3. Create the .env file and insert your values the following variables (for DB credentials use the same defined in the docker-compose file).
	```
	API_PORT=5001
	DATABASE_URL=postgresql://<USER_DB>:<PASS_DB>@localhost:5432/reto_yape_dev?connect_timeout=300
	KAFKA_BROKER=localhost:9092
	```
4. Run `npm run start:prisma` to generate prisma dependencies.
5. Run `npm run start:dev` to start the microservice.

## ANTI-FRAUD Microservice Setup

1. Go to directory `anti-fraud-microservice`
2. Run `npm i` to install dependencies.
3. Create the .env file and insert your values the following variables.
	```
	KAFKA_BROKER=localhost:9092
	```
4. Run `npm run start:dev` to start the microservice.


# GraphQL API Documentation

Open your browser and go to http://localhost:5001/graphql

### Create transaction
```graphql
mutation  {
  createTransaction(createTransactionInput:{
    accountExternalIdDebit: "c3281685-b097-4d9a-a284-ef232af5eb32" ,
    accountExternalIdCredit: "ca7a6efa-e39f-4650-af63-2e40455850ce",
    transferTypeId: 1,
    value: 999.9
  }){
    transactionExternalId,
    transactionType{name},
    transactionStatus{name},
    value,
    createdAt
  }
}
```


### Retrieve transaction
```graphql
query{
  retrieveTransactionById(id:"ca7a6efa-e39f-4650-af63-2e40455850ce"){
    transactionExternalId,
    transactionType{name},
    transactionStatus{name},
    value,
    createdAt
  }
}
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[NestJS]: https://skillicons.dev/icons?i=nestjs
[NestJS-url]: https://nestjs.com/
[Typescript]: https://skillicons.dev/icons?i=ts
[Typescript-url]: https://www.typescriptlang.org/
[GraphQL]: https://skillicons.dev/icons?i=graphql
[GraphQL-url]: https://graphql.org/
[Prisma]: https://skillicons.dev/icons?i=prisma
[Prisma-url]: https://www.prisma.io/
[Postgres-url]: https://www.postgresql.org/
[Postgres]: https://skillicons.dev/icons?i=postgres
[Kafka]: https://i.postimg.cc/5t6vtzpF/kafka-icon-48.png
[Kafka-url]: https://kafka.apache.org/
[Docker]: https://skillicons.dev/icons?i=docker
[Docker-url]: https://www.docker.com/