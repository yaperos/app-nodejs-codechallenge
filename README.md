# YAPE challenge

las intrucciones del challenge estan el CHALLENGE_README.md

## Proyectos

se hicieron 3 proyectos para resolver el challenge:
 * api: donde se crean las transacciones, actualiza y lista
 * antifraude: el cual califica las transacciones
 * finances: un pequeño front end para visualizar las transacciones

## Instrucciones

Iniciamos inicializando el docker-compose

```sh
  $ docker compose up
```

creamos los topicos pero necesitamos saber el nombre del contenedor

```sh
 $ docker ps
```

```sh
CONTAINER ID   IMAGE                                    COMMAND                  CREATED        STATUS       PORTS                          NAMES
efb19183117b   confluentinc/cp-enterprise-kafka:5.5.3   "/etc/confluent/dock…"   15 hours ago   Up 8 hours   0.0.0.0:9092->9092/tcp         app-nodejs-codechallenge-kafka-1
```

una vez identificado el nombre del contenedor
```sh
 $ docker exec -it app-nodejs-codechallenge-kafka-1 /bin/sh
```

y ahora si creamos los topicos 2 para el entorno de development y 2 para los test

```sh
  kafka-topics --zookeeper zookeeper:2181 --create --if-not-exists --topic api-topic --replication-factor 1 --partitions 1
  kafka-topics --zookeeper zookeeper:2181 --create --if-not-exists --topic antifraud-topic --replication-factor 1 --partitions 1

  kafka-topics --zookeeper zookeeper:2181 --create --if-not-exists --topic api-test-topic --replication-factor 1 --partitions 1
  kafka-topics --zookeeper zookeeper:2181 --create --if-not-exists --topic antifraud-test-topic --replication-factor 1 --partitions 1
```

### API

Este proyecto es para la creación de las transacciones, al crear la transaccion a la bd y manda a kafka, espera la llamada de kafka que es la evaluación del antifraude para que luego actualizar a la bd con la decisión y tambien hace un emit por el websocket

En la carpeta `/api`hacemos los siguientes pasos

instalamos los modulos
```sh
 $ yarn
```

```sh
 $ yarn migrate:test
```

corremos las pruebas
```sh
 $ yarn test
```
corremos las migraciones para dev
```sh
 $ yarn migrate:dev
```
e inicializamos el proyecto
```sh
 $ yarn start
```

### ANTIFRAUD

Este proyecto simula el antifraude que califica la transaccion por medio de un score y lo manda a kafka

En la carpeta `/antifraud` instalamos los modulos

```sh
 $ yarn
```

e inicializamos el proyecto

```sh
 $ yarn start
```

### finances

Este proyecto es para una visualizacion para crear transacciones y listas de ellas

instalamos los modulos
```sh
 $ yarn
```

```sh
 $ yarn dev
```

podras visualizar en `http://localhost:3000`