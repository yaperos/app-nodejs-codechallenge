# yape-main

## Dependencies

-   npm
-   node (v20)

## Start in development

First create a `.env` file with the required enviroment variables, checkout `.env.example` for guidance.

Eg.

```
PORT = 3000
HOST = "0.0.0.0"
DATABASE_URL = "postgres://postgres:postgres@localhost:5432/postgres"
KAFKA_URL = "localhost:9092"
KAFKA_CLIENT_ID = "CLIENT_ID_1234"
KAFKA_GROUP_ID = "GROUP_ID_1234"
```

Start the server running the following command:

```sh
sh run.sh
```