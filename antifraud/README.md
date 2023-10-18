# Micro Antifraud
Este micro esta suscrito a un topico:
    
* transactionCreated:

    Se evalua si una transaccion debe o no ser aprobada. Segun la logica emite un evento a alguno de estos topicos :
  * transactionApproved : en caso se aprueba la transacion
  * transactionRejected : en caso se rechace la transaccion

### Variables de entorno
Ese micro requiere que esten configuradas estas variables:
````dotenv
#Micro Port
PORT=3002
#Server Kafka
KAFKA_SERVER=localhost:9092
````

### Run in local environment
Define file .env in root folder, whit values:
````dotenv
#Micro Port
PORT=3002
#Server Kafka
KAFKA_SERVER=localhost:9092
````
Install dependencies:
````shell
npm install
````
Run Micro in local environment:
````shell
npm run start:dev
````

## Test E2E
For testing is implementing memory database postgres
````shell
npm run test:e2e
````


[//]: # (### Run individuality this micro with docker)

[//]: # (1. Build docker image:)

[//]: # (````shell)

[//]: # (docker build -t micro-antifraud-gustavo-condezo:latest .)

[//]: # (````)

[//]: # (2. Run docker container)

[//]: # (````shell)

[//]: # (docker run --name micro-antifraud -p 3005:3000 -e KAFKA_SERVER="localhost:9092" -e PORT=3000 micro-antifraud-gustavo-condezo:latest)

[//]: # (````)
