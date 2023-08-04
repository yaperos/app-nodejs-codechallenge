

# Awesome Project Build with TypeORM

Pasos para correr este proyecto:

1. Leer el challenge de la siguiente URL: https://github.com/yaperos/app-nodejs-codechallenge/tree/main
2. Tener instalado typescript,node, kafka y postgresql dentro del sistema a probar
   1. Se puede tener instalado postgressql y kafka en docker, descargado el docker-compose.yml de la siguiente URL: https://github.com/yaperos/app-nodejs-codechallenge/blob/main/docker-compose.yml
   2. Si se va a ejecutar via docker compose ejecutar los siguientes comandos asumiendo que se tenga docker correctamente instalados:
   ```bash
      # Ejecucion de los servicios en docker
      sudo docker-compose -f docker-compose.yml up -d
      # Ejecucion de la consola interactiva de kafka desplegado
      sudo docker exec -it challenge_transaction_kafka_1 /bin/bash
      #Dentro de la consola en docker
      #Creacion de los topics
      kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 partitions 1 --topic transaction
      kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 partitions 1 --topic antifraud
   ```
3. correr dentro del proyecto `yarn install` command
4. Configurar los ambientes en el archivo `.env`
   1. Solo modificar los siguientes enviroments:
   ```bash
      # Puerto del API en Node js
      PORT=3000
      #Parametros de conexion de la base de datos Postgresql
      #Nota: Se debe crear la base de datos dentro de la base de datos bajo el nombre "transaction"
      PGSQL_DATABASE='transaction'
      PGSQL_USERNAME='Colocar aqui su usuario'
      PGSQL_PASSWORD='Colocar aqui su clave'
      PGSQL_SYNCHRONIZE='false'
      PGSQL_LOGGING='false'
      PGSQL_HOST='localhost'
      PGSQL_PORT=5432
      #Parametros de conexion de kafka
      KAFKA_CLIENT_ID='api-transaction'
      KAFKA_BROKERS='localhost:9092'
      KAFKA_GROUP_ID='antifraud-group'
      KAFKA_CONSUMER_ID='antifraud'
   ```
5. Correr las migraciones `yarn migration:ts`
6. Correr el ambiente de pruebas `yarn nodemon`
7. ejecutar una consulta post, del archivo yape.postman_collection.json para ejecutar la subcripcion a el canal de antifraud de kafka, solo se requiere una sola vez
8. Diagrama de componentes de conexion de los adaptadores de Kafka en cada proyecto
   ![Alt text](https://github.com/fabpin/yape-transaction/blob/main/diagrama_de_componentes_de_yape_kafka_challenge.png?raw=true "Optional title")

**Nota** Las tecnologias utilizadas en este proyecto son las siguientes:
- TypeORM
- Node.js
- Typescript
- Express
- Arquitectura Hexagonal/Arquitectura Limpia/Arquitectura en Capas
- Postgresql
- Kafka
- Docker

