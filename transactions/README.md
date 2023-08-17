# Micro transaction
Este micro esta suscrito a dos topicos topico:

* transactionApproved:
  
* transactionRejected:

Expone 2 Apis:
  * Crea una transaccion

    path: /transaction

    method: POST
  ````shell
  curl --location 'http://localhost:3000/transaction' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'accountExternalIdDebit=9035832f-5590-4e93-b13e-0f68b81217a7' \
--data-urlencode 'accountExternalIdCredit=4f60f1ad-9f4d-4448-8e7c-bb363f9e345f' \
--data-urlencode 'transferTypeId=1' \
--data-urlencode 'value=100'
````
  * Consulta una transacion
    
    path: /transaction/{uuid_transaction}

    method: GET

Ejemplo: Reemplaze el uuid_transaction
````shell
curl --location 'http://localhost:3000/transaction/e8580bae-634a-4adc-bda0-5fa5ed30ece5'
````  


### Variables de entorno
Ese micro requiere que esten configuradas estas variables:
````dotenv
#Database Postgres
DB_NAME=db_yape
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres

KAFKA_SERVER=localhost:9092
#Micro
PORT=3000

````

### Run in local environment
Must be ex
Define file .env in root folder, whit values:
````dotenv
#Database Postgres
DB_NAME=db_yape
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres

KAFKA_SERVER=localhost:9092
#Micro
PORT=3000
````
Install dependencies:
````shell
npm install
````
Run Micro in local environment
````shell
npm run start:dev
````


## Test E2E
For testing is implementing memory database postgres
````shell
npm run test:e2e
````
