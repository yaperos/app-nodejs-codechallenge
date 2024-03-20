
# Microservice transaction

The project is an application that facilitates the integration and management of financial transactions. The main functionality includes:

- **Add Transactions**: Allows adding transactions coming from an API or GraphQL.
  
- **Integration with MS-Antifraud**: After receiving the transactions, they are sent to the antifraud microservice via Kafka. This ensures a secure and reliable process for detecting possible fraud or suspicious activities.

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

#### After creating the database: `yape_challenge` execute the command to migrate tables
```bash
$ yarn run prisma:migrate:dev
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

## Http API

#### POST

```json
# Use your reference http client, in my case it was tested by Postman
# Body:
{
    "amount": 999,
    "accountExternalName": "Jhon Birreo",
    "transferTypeName": "DEBIT"
}
```
#### GET

```bash
# Use your reference http client, in my case it was tested by Postman
# Params:
`http://localhost:3000/transaction/71148b13-326b-4ddf-a4d8-9b8a9f1883dd`
```

## Graphql API

#### CREATE

```js
mutation { # create new transaction
  createTransaction (
	data : {
    amount: 3000,
		accountExternalName: "testin",
		transferTypeName: DEBIT
  }
  ) {
			amount
			accountExternalName
			transferTypeName
		}
}
```
#### FIND

```js
query {  # get transaction
 findFirstTransaction (
		where : {
			externalId: {
				contains : "9b48ebf7-c7ef-4454-b207-afd3c5797b01"
			}
		}
  ) {
      externalId
			status
			transferTypeName
    }
}
```

## Swagger documentation 
```
http://localhost:3000/doc
```
