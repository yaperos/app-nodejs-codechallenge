# Description

This is a Nest JS generated with NestJS (^10.0.0)

## Pre Installation

Install nvm & node >20.9.0

You need access to a running postgres instance (Local, docker or RDS) with full grants

## Docker install & run

```
docker-compose up -d
```

## Installation

```bash
$ yarn install
```

## Running the app

You can start the app using the Nest CLI:

```bash
# Using the CLI
$ nest start
```

Add a .env file in the root of the project; an .env.example can be found in the root

## Test

```bash
# unit tests
$ yarn test
# e2e tests
$ yarn test:e2e
# test coverage
$ yarn test:cov
```

## Running Migrations

The app auto-runs the migrations when is started for first time and the environment `MAIN_DB_RUN_MIGRATIONS` is set to `1`; because it runs the js files from de dist directory, you should run `yarn build` in order to generate the appropiate migration files before start the app.

Note that the `MIGRATIONS_PATH` env variable must be set to `'/dist/database/migration/*.{js,ts}'` in local and `/database/migration/*.{js,ts}` to other deployed environments.

In case that you want to run the migrations manually, run the next commands:

```bash
# to generate migration
$ yarn migrations:generate <migration_name>
# to run migrations:
$ yarn migrations:run
```

## Running Test

In case you want to run the unit tests, implement the following command:

```bash
# to run all test in api yape challenge
$ yarn test
# to run test in mode watch and you can select a test and you can select a specific test
$ yarn test:watch
```

## Endpoint documentation

I attach the url where you can view the endpoints that implement the application. Note that the endpoint where the transactions are created receives an array of many transactions.

```bash
[Postman](https://documenter.getpostman.com/view/7918195/2s9YC5xrps)
```
