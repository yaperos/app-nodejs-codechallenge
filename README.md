# SOLUTION: Yape Code Challenge

La solución del reto ténico esta desglosado en dos proyectos, esto debido a que se puede escalar cada proyecto independientemente
- Proyecto "anti-fraud"
- Proyecto "transaction"

# Ejecutar el proyecto en modo local

## 1. Clonar el proyecto "app-nodejs-codechallenge"
```
git clone https://github.com/yaperos/app-nodejs-codechallenge.git
```

## 2. Proyecto "transaction"
2.1. Instalar las dependencias
```
npm install
```

2.2. Renombrar el archivo ".env.local" por ".env"

2.3. Ejecutar docker para habilitar la base de datos Postgre y Kafka
```
docker-compose up -d
```

2.4. Ejecutar la migración de la creación de las tablas e inserción de datos
```
    npx prisma migrate dev
    npx prisma db seed
```
2.5. Levantar el proyecto en modo local
```
npm run start:dev
```

## 3. Proyecto "anti-fraud"
2.1. Instalar las dependencias
```
npm install
```
2.2. Renombrar el archivo ".env.local" por ".env"

2.3. Levantar el proyecto en modo local
```
npm run start:dev
```

## 4. Documentación: ``openapi.yaml``

## 5. Postman Curl
#### GET: ``/transactions/{{id}}``
````
curl --location 'http://localhost:3000/transactions/ba67c7d2-3010-4c52-8818-48848b17b137'
````
#### POST: ``/transactions``
````
curl --location 'http://localhost:3000/transactions' \
--header 'Content-Type: application/json' \
--data '{
"accountExternalIdDebit": "21122121121212",
"accountExternalIdCredit": "3e343443433443",
"transferTypeId": "23d03c79-821c-4ef2-9d28-ba2e4ce626a5",
"value": 12
}'
````


---
# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.
