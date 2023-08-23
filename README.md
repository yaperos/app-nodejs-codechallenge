## NOTA

- He subido los proyectos con el node-modules integrado en caso sea necesario, caso contrario, puede eliminarlo y volver a instalar.  sea necesario eliminarlo e instalar nuevamente.

- He Agregado un video mostrando la funcionalidad del reto tecnico, si desea puede descargarlo y revisarlo.

## NOTA 2

1. La imagen `confluentinc/cp-enterprise-kafka:5.5.3` no pudo inicializarse en mi macbook con Chip M1.
2. Dentro de mi challenge-transactions-ms tengo un `docker-compose.yml`, en la cual
   estoy utilizando una imagen kafka distinta `image: confluentinc/cp-kafka:latest`, si me funciona.
3. Para las pruebas puede utilizar el docker que integraron en el repositorio o el mio.


## RECORDAR

- El nombre de la BD que estoy utilizando en el postgress es :
  - POSTGRES_DB=transacionValidationDB
- En caso no funcione mi imagen kafka `image: confluentinc/cp-kafka:latest` utilizar el que ustedes agregaron en su docker-compose `confluentinc/cp-enterprise-kafka:5.5.3`

## DOCKER-COMPOSE que estoy utilizando, `lo puede encontrar en challenge-transactions-ms`

version: '3.7'
services:
postgres:
image: postgres:14
ports: - '5432:5432'
environment: - POSTGRES_USER=postgres - POSTGRES_PASSWORD=postgres - POSTGRES_DB=transacionValidationDB
zookeeper:
image: confluentinc/cp-zookeeper:5.5.3
environment:
ZOOKEEPER_CLIENT_PORT: 2181
kafka-broker-1:
image: confluentinc/cp-kafka:latest
container_name: kafka-broker-1
depends_on: - zookeeper
environment:
KAFKA_BROKER_ID: 1
KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
ports: - '9092:9092'
