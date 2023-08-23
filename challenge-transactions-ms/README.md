# Card Validation

Prueba tecnica Yapero Transactions

## Requisitos

- Node.js (versión v14.17.3) o superior
- npm (viene con Node.js)
- Tener libre el puerto 80

## Tecnologias

- Node.js versión 18
- npm
- SQRC
- Docker
- TypeOrm
- NestMicroservice
- Kafka
- Nest
- Jest
- Eslint

## Instalación

1. Instala las dependencias: `npm install` de preferencia la version del node indicado lineas arriba.

## Descripción

1.  `Transaction-ms` : primero generamos una transacción.
2.  Guarda la transacción a la BD y envia un evento al `anti-fraud-ms` para validar el value.
3.  El ms anti-fraud valida el value recibido, envia el estado y el transactionExternalId.
4.  `transactions-ms` recibe el transactionExternalId y el status.
5.  `transactions-ms` actualiza el estado de la transacción. REJECTED OR APPROVED

## Uso

1. Ejecuta `docker-compose up -d`
2. Ejecuta el proyecto : `npm run start` -- anteponer sudo en caso sea necesario.
3. Correran 2 Endpoints : /transaction-verify GET y /transaction-verify POST
4. En el postman importar el curl POST transaction-verify : Genera una transacción
   curl --location --request POST 'http://localhost:80/transaction-verify' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "accountExternalIdDebit": "f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5",
   "accountExternalIdCredit": "f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5",
   "transferTypeId": 2,
   "value": 1000
   }'
5. En el postman importar el curl Get transaction-verify: Realiza la busqueda de la transacción por el `transactionExternalId`
   curl --location --request GET 'http://localhost:3000/dev/card/get-card' \
   --header 'X-Api-Key: pok123opkwqopkdwqok321' \
   --header 'Authorization: Bearer 7yi8oYcD3Da3UqRg'

## Unit Test

1. Para correr las unit test en la consola: `npm run test`

## Lint

1. Para correr el lint `npm run lint`
