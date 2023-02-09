## Description

Backend application.

## Configuration
create kafka topic: 'transaction'
```bash
# set config values in .env file
$ cp .env_example .env
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test
```

## Docs

[http://localhost:3000/docs](http://localhost:3000/docs)

## Test endpoints
```
curl --location --request POST 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--data-raw '{
  "accountExternalIdDebit": "07261b14-7db4-444d-9373-898a7abb1f08",
  "accountExternalIdCredit": "a7eefd9a-36b9-4393-b967-e7999a923b3e",
  "tranferTypeId": 6,
  "value": 666
}'
```

```
curl --location --request GET 'http://localhost:3000/transactions/a43fdfa0-efb7-4596-b20c-071cda8e1bc0'
```

## Docker run
```bash
# root path /
$ docker-compose up
```
