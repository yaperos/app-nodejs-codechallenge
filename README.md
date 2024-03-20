
# Summary

This project implements two microservices, one for transactions and one for anti-fraud, using technologies such as Kafka, GraphQL and HTTP API. A clean and scalable architecture is followed to ensure efficient development and maintenance.
- mention that microservices are independent, therefore they can be built independently

## Requirements before starting
- **Nodejs v21**
- **Kafka**
- **Docker**
- **PostgreSQL**

## Dependencies
Run the main services for correct operation using the `deploy.sh` file and make sure the following services are running.
zookeeper
- kafka
- db-postgres
- ms-transaction
- ms-antifraud

#### Execute command
```sh
chmod +x deploy.sh
```

#### Run services
```sh
./deploy.sh
```

## Http API

#### POST

```ssh
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
