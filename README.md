# Code Challenge Solved

## Installation

The solution requires latest version of [Docker](https://www.docker.com/) for the enviroment.

Deploy enviroment:

```sh
docker-compose up -d
```

Configure the DB for master and read replicas, need to run all commands which is the path:

```sh
docker/config_postgres.sh
```

Install dependencies:

```sh
npm i
```

To deploy anti-fraud microservice, execute the command:

```sh
npm run start:anti-fraud
```

To deploy yape application and create tables in DB, execute the command:

```sh
npm run start:yape
```

Run the queries to create transaction types and transaction states:

```sh
database/insert.sql
```

**To test the services need to open the url http://localhost:8050/graphql where is the documentation and interact with the playground**

## License

MIT
