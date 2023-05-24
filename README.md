# Yape Code Challenge - Rodrigo Guadalupe
This repository includes the implementation of `Yape Code Challenge` ([instructions here](./old.md)), that consists on a GraphQL API that manages Transactions and a Anti-Fraud service used to validate all created Transactions.
## Tech Stack
- Typescript
- Node.js + Express.js
- Prisma ORM + Postgres
- Kafka
- GraphQL
- Docker

## Project Structure
The project structure is organized in the following directories: 
```
.
├── anti-fraud-service      # Anti-Fraud Express app
    ├── src                 # Source files of the solution
    └── test                # Tests for solution services
├── transactions-service    # Transactions Express app
    ├── src                 # Source files of the solution
    ├── prisma              # Prisma ORM schema definition and migrations
    └── test                # Tests for solution services
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Environment Variables
The project has 2 main environment variables: 
```
KAFKA_HOST_URL   # Host where the Kafka cluster is running
DATABASE_URL     # Postgres SQL database connection url
```

## Execution
Here we could find guides to test, build and execute the solution.
### Run tests
In order to run the project unit tests, we first need to go to `transactions-service` directory.
```sh
cd transactions-service
```
Then, we need to install the project's dependencies.
```sh
yarn install 
# or
npm install
```
Finally, to execute the unit test we run:
```sh
yarn test
# or
npm test
```
Tests run will be shown on CLI and a jest `coverage` report will be displayed and saved on a `coverage` directory.

We would follow the same steps to run the unit tests from the Anti-Fraud service, but this time with the `anti-fraud-service` directory.
```sh
cd anti-fraud-service
yarn install  or  npm install
yarn test  or  npm test
```

### Build package
In order to generate a deployment ready build, we would follow the next steps for both applications:
```sh
cd transactions-service
#or
cd anti-fraud-service
```
Then, we need to install the project's dependencies.
```sh
yarn install 
# or
npm install
```
Finally, to create the build run the following command:
```sh
yarn build
# or
npm build
```
This will first execute the following steps: 
 - Run project's tests
 - Create a Typescript build using the tsconfig.build.json file
 - Copy the GraphQL schema file to `dist` folder using [copyfiles](https://www.npmjs.com/package/copyfiles) package (Only for `transactions-service`)

## Docker Execution
Before starting the execution process: 
 - Make sure that you have docker already installed (it could be [docker-desktop](https://docs.docker.com/desktop/) or [docker-engine](https://docs.docker.com/engine/)).
 - Make sure you have docker Compose plugin installed (install [compose-plugin](https://docs.docker.com/compose/install/)). IMPORTANT: If you have a docker-desktop installation, the Compose plugin is already included.

First, we need to be on project `root` directory. There, we need to run the following command to build the services specified on the `docker-compose.yml` file: 

```sh
docker compose -f "docker-compose.yml" up -d --build 
```

The compose file will create and run the following: 
```
- Zookeeper             (PORT:'2182')
- Kafka cluster         (PORT:'9092')
- Postgres DB           (PORT:'5432', USER:'postgres', PASSWORD:'postgres')
- PgAdmin               (PORT:'5050', EMAIL:'admin@admin.com', PASSWORD:'root')
- Transactions Service  (PORT:'3000')
- Anti-Fraud Service    (PORT:'3005')
```

The file will also create a service that would be in charge of creating the needed `topics` for producers and consumers communication

After the execution is completed, there is one last step to start using the application. We will call a seed function to populate the `Transaction Type` table with some pre-defined values: 

```sh
yarn prisma db seed
# or
npm prisma db seed
```
This seed will create the following rows:
```
[
  { id: 1, name: 'Transaction 1' },
  { id: 2, name: 'Transaction 2' },
  { id: 3, name: 'Transaction 3' }
]
```

#### That's All !!

Now you can go to the [Transaction Service GraphQL Playground](http://localhost:3000/graphql) to start using the app. 


### Other useful commands:

- Stop all the services
```sh
docker compose -f "docker-compose.yml" down 
```

- Restart all the services (It would execute down and up sequentially)
```sh
docker compose -f "docker-compose.yml" down 
docker compose -f "docker-compose.yml" up -d --build 
```
## API Consumer Experience 

A ready-to-use playground is created for the `transactions-service` on the `/graphql` endpoint.

Documentation of schema, queries and mutations can also be found inside the playground.