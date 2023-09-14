## Description

This is a Nest JS with a DDD implementation template, generated with NestJS (^9.0.0)

## Pre Installation

Install nvm & node >20.6.1

You need access to a running postgres instance (Local, docker or RDS) with full grants

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

## Running Migrations

The app auto-runs the migrations when is started for first time and the environment `MAIN_DB_RUN_MIGRATIONS` is set to `1`; because it runs the js files from de dist directory, you should run `yarn build` in order to generate the appropiate migration files before start the app.

Note that the `MIGRATIONS_PATH` env variable must be set to `'/dist/database/migration/*.{js,ts}'` in local and `/database/migration/*.{js,ts}` to other deployed environments.

In case that you want to run the migrations manually, run the next commands:

```bash
# First create the ormconfig.json file with
$ yarn pretypeorm
# Config typeorm with command
$ yarn typeorm
# to generate migration
$ yarn migrations:generate <migration_name>
# to run migrations:
$ yarn migrations:run
```

## Postman document

These are the endpoints that exist as described in the request

[Postman]: https://documenter.getpostman.com/view/7918195/2s9YC5xrps
