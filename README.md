# Proyecto: Microservicio de Transacciones Financieras con Validación Antifraude y Kafka

## Descripción

Este proyecto implementa un sistema de transacciones financieras distribuidas con validación antifraude, utilizando el patrón **CQRS, EVENT SOURCING** con Kafka como un event store (por motivos de la prueba). La implementación de estos patrones es por el requerimiento de que pueda estar optimizado para un tráfico alto. Los microservicios están desacoplados y se comunican mediante **Kafka** para garantizar la consistencia de las transacciones y el manejo eficiente de errores.

El sistema consta de varios microservicios que colaboran para crear, validar y actualizar transacciones:

- **ms-transaction-cm**: Crea las transacciones y actualiza el estado en la BD de escritura.
- **ms-anti-fraud**: Valida las transacciones (rechaza aquellas con un valor mayor a 1000).
- **ms-transaction-qr**: Permite consultar el estado de las transacciones.
- **api-gateway**: Permite tener un único punto de acceso y derivar las solicitudes a los microservicios correspondientes.
- **Kafka**: Sistema de mensajería para la comunicación entre los microservicios.

## Tecnologías Usadas

- **NestJS**: Framework de Node.js para la construcción de microservicios.
- **Kafka**: Sistema de mensajería para la comunicación asíncrona entre microservicios.
- **PostgreSQL**: Base de datos para almacenar las transacciones.
- **Prisma**: ORM para interactuar con la base de datos en NestJS.
- **Docker**: Para crear un entorno de desarrollo aislado.

## Arquitectura Big Picture

![App Screenshot](https://i.ibb.co/YT28dB4G/Diagrama-sin-ti-tulo.jpg)

1. La aplicación solicita al backend crear una nueva transacción, el API-GATEWAY redirige al microservicio correspondiente.
2. Mediante Kafka, el API-GATEWAY redigire la petición al microservicio ms-transaction-cm.
3. El microservicio crea la transacción en la base de datos "transaction_command_db" y devuelve al usuario la resuesta con los datos de la transacción,
4. 4.1. 4.2. A su vez, el microservicio ms-transaction-cm emite un evento asíncrono de la creación de la transacción al microservicio ms-transaction-qr y ms-anti-fraud, para que puedan actualizar la base de datos de lectura "transaction_query_db" y validar la transacción correspondientemente.
5. El microservicio ms-anti-fraud luego de valida asincronamente la transacción, notifica al ms-transaction-cm el resultado.
6. El microservicio ms-transaction-cm actualiza la base de datos "transaction_command_db" y a su vez emite un evento asíncrono al ms-transaction-qr para que actualize los datos de la transacción.
7. Con el ID de la transacción el app podrá obtener los datos de la transacción en cualquier momento.

## Requisitos

1. **Docker** y **Docker Compose** para la configuración de los microservicios, Kafka y las bases de datos.

## Variables de entorno

| Proyecto          | Variable                               | Descripción                     | Valor por defecto                                                                         |
| ----------------- | -------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| postgres-command  | POSTGRES_DB                            | Nombre de la base de datos      | transaction_command_db                                                                    |
| postgres-command  | POSTGRES_USER                          | Usuario de la base de datos     | postgres                                                                                  |
| postgres-command  | POSTGRES_PASSWORD                      | Contraseña de la base de datos  | postgres                                                                                  |
| postgres-query    | POSTGRES_DB                            | Nombre de la base de datos      | transaction_query_db                                                                      |
| postgres-query    | POSTGRES_USER                          | Usuario de la base de datos     | postgres                                                                                  |
| postgres-query    | POSTGRES_PASSWORD                      | Contraseña de la base de datos  | postgres                                                                                  |
| zookeeper         | ZOOKEEPER_CLIENT_PORT                  | Puerto del zookeeper            | 2181                                                                                      |
| kafka             | KAFKA_ZOOKEEPER_CONNECT                | Conexión al zookeeper           | zookeeper:2181                                                                            |
| kafka             | KAFKA_ADVERTISED_LISTENERS             | Lista de listeners              | PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092                                   |
| kafka             | KAFKA_LISTENER_SECURITY_PROTOCOL_MAP   | Protocolo de seguridad          | PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT                                              |
| kafka             | KAFKA_BROKER_ID                        | ID del broker                   | 1                                                                                         |
| kafka             | KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR | Factor de replicación del topic | 1                                                                                         |
| kafka             | KAFKA_JMX_PORT                         | Puerto JMX                      | 9991                                                                                      |
| api-gateway       | CLIENT_GATEWAY_PORT                    | Puerto del gateway              | 3000                                                                                      |
| api-gateway       | KAFKA_BROKER                           | Broker de kafka                 | kafka:29092                                                                               |
| ms-transaction-qr | PORT                                   | Puerto del microservicio        | 3001                                                                                      |
| ms-transaction-qr | DATABASE_URL                           | URL de la base de datos         | postgresql://postgres:postgres@postgres-query:5432/transaction_query_db?schema=public     |
| ms-transaction-qr | KAFKA_BROKER                           | Broker de kafka                 | kafka:29092                                                                               |
| ms-transaction-cm | PORT                                   | Puerto del microservicio        | 3002                                                                                      |
| ms-transaction-cm | DATABASE_URL                           | URL de la base de datos         | postgresql://postgres:postgres@postgres-command:5432/transaction_command_db?schema=public |
| ms-transaction-cm | KAFKA_BROKER                           | Broker de kafka                 | kafka:29092                                                                               |
| ms-anti-fraud     | PORT                                   | Puerto del microservicio        | 3003                                                                                      |
| ms-anti-fraud     | KAFKA_BROKER                           | Broker de kafka                 | kafka:29092                                                                               |
|                   |

## Instalación y Configuración

### 1. Clonar el Repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/{username}/app-nodejs-codechallenge.git
cd app-nodejs-codechallenge
```

Moverse de la rama `main` a la rama `feat/transaction`

```bash
git checkout feat/transaction
```

### 2. Iniciar el proyecto

#### 2.1. Modo desarrollo

Si se esta ejecutando el proyecto en modo producción, es necesario detener los servicios antes de iniciar el modo desarrollo.

```bash
  docker-compose stop
```

Para iniciar el proyecto en modo desarrollo, ejecuta el siguiente comando:

```bash
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

Este comando iniciará todos los servicios necesarios para ejecutar el proyecto en modo desarrollo.

En caso de que se requiera iniciar los servicios individualmente, puede utilizar los siguientes comandos:

```bash
  docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build ms-transaction-cm
```

```bash
  docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build ms-transaction-qr
```

```bash
  docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build ms-anti-fraud
```

```bash
  docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build api-gateway
```

#### 2.2. Modo producción

Si se esta ejecutando el proyecto en modo desarrollo, es necesario detener los servicios antes de iniciar el modo producción.

```bash
  docker-compose stop
```

Para iniciar el proyecto en modo producción, ejecuta el siguiente comando:

```bash
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Este comando iniciará todos los servicios necesarios para ejecutar el proyecto en modo producción.

## Ejecución

### 1. Crear una nueva transacción

#### Request

```bash
URL POST
http://localhost:3000/transaction/create
```

```json
{
  "accountExternalIdDebit": "Guid", // UUID cualquiera
  "accountExternalIdCredit": "Guid", // UUID cualquiera
  "transferTypeId": 1,
  "value": 120
}
```

#### Response

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

### 2. Consultar la transacción

#### Request

#### Request

```bash
URL GET
http://localhost:3000/transaction/detail/{transactionExternalId}
```

#### Response

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

## Siguientes pasos

- [ ] Separar los microservicios por capas, una capa canal y otra multicanal.
- [ ] Definir los microservicios de acuerdo a su rol, ejemplo: UX, Open Insurance, Negocio, Batch, etc.
- [ ] Implementar un Api management para la organización y seguridad de los microservicios.
- [ ] Implementar el patron Saga para la orquestación de transacciones.
- [ ] Para la BD de lectura, se puede utilizar Redis como base de datos.
- [ ] Implementar la autenticación y autorización de los microservicios.
- [ ] Implementar un sistema de alertas para la monitorización de los microservicios.

## Conclusión

Este proyecto es un ejemplo de cómo se pueden implementar microservicios distribuidos con Kafka y CQRS para una aplicación de transacciones financieras. El código fuente está disponible en el repositorio de GitHub y se puede clonar y ejecutar en su propio equipo.
