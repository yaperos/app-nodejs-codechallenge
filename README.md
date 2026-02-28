# Yape Code Challenge Solution 🚀

Este repositorio contiene la solución para el Desafío de Código Yape. El problema consiste en validar transacciones financieras mediante un servicio antifraude, garantizando que cada transacción mayor a 1000 sea rechazada y actualizando el estado de la transacción según corresponda.

> **Nota:** Las instrucciones originales del desafío se encuentran en [CHALLENGE.md](CHALLENGE.md).

## 🏗 Architecture & Tech Stack

Para manejar **Escenarios de Alto Volumen** de manera efectiva, se ha implementado una **Arquitectura Orientada a Eventos** combinada con **Programación Reactiva**. 

### Technologies Used

- **Java 21**: Aprovechando las características modernas del lenguaje para un mejor rendimiento.
- **Spring Boot 4.0.3 (WebFlux)**: Enfoque reactivo y no bloqueante para manejar miles de solicitudes concurrentes con un consumo mínimo de recursos.
- **Apache Kafka**: Utilizado como broker de mensajes para la comunicación asíncrona entre microservicios, asegurando alto rendimiento, resiliencia y procesamiento desacoplado.
- **PostgreSQL (R2DBC)**: Base de datos relacional robusta conectada a través de un driver reactivo para prevenir bloqueos de I/O.
- **Redis**: Base de datos en memoria utilizada como caché para mejorar el rendimiento.
- **GraphQL**: API para la recuperación de datos.
- **Gradle**: Herramienta de automatización de compilación.
- **Docker & Docker Compose**: Contenedorización de la infraestructura y microservicios para una implementación y pruebas sin interrupciones.

### Microservices

1. **Transaction Service (`transaction-service`)**:
   - Expone endpoints reactivos para crear y recuperar transacciones.
   - Gestiona la base de datos PostgreSQL y persiste las transacciones inicialmente como `PENDING`.
   - Utiliza Redis como caché para mejorar el rendimiento.
   - Expone una API GraphQL para la recuperación de datos.
   - Produce eventos asíncronos (`transaction-created`) a Kafka.
   - Escucha las actualizaciones de estado (`transaction-status`) desde Kafka para actualizar la base de datos de forma asíncrona.
   - Implementado utilizando patrones de **Arquitectura Limpia** (capas de Dominio, Aplicación e Infraestructura).

2. **Anti-Fraud Service (`anti-fraud-service`)**:
   - Actúa puramente como un consumidor de eventos robusto en segundo plano.
   - Valida las transacciones estrictamente según la regla de negocio `value > 1000`.
   - Responde publicando el estado final (`APPROVED` o `REJECTED`) de vuelta al tópico de Kafka `transaction-status`.

## ⚙️ How to Run Locally

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.
- (Optional) Java 21 to run outside of containers.

### 1. Build and Run via Docker Compose (Recommended)

La forma más sencilla de iniciar todo el ecosistema (Postgres, Zookeeper, Kafka, Transaction Service, Anti-Fraud Service) es utilizando Docker Compose.

```bash
# Desde la raíz del proyecto, construye e inicia todos los contenedores en segundo plano
docker-compose up --build -d
```

Puedes verificar que los 5 contenedores estén funcionando correctamente:
```bash
docker-compose ps
```

Para detener los servicios más tarde:
```bash
docker-compose down
```

### 2. Manual Run using Gradle (Development mode)
Si prefieres ejecutar los microservicios localmente fuera de Docker (teniendo solo la infraestructura en Docker):

```bash
# 1. Inicia solo la infraestructura (Postgres, ZooKeeper, Kafka)
docker-compose up -d postgres zookeeper kafka

# 2. Ejecuta el Transaction Service
cd transaction-service
./gradlew bootRun

# 3. Ejecuta el Anti-Fraud Service (en una terminal separada)
cd anti-fraud-service
./gradlew bootRun
```

## 🛠 API Usage

Una vez que el ecosistema esté funcionando, la **API del Transaction Service** estará disponible en `http://localhost:8080`.

### 1. Create a Transaction
Crea una nueva transacción. Esto la almacenará instantáneamente como `PENDING` e iniciará el flujo de validación de Kafka.

**Endpoint:** `POST /api/transactions`

**Body:**
```json
{
  "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "accountExternalIdCredit": "8f285f64-5717-4562-b3fc-2c963f66afa7",
  "tranferTypeId": 1,
  "value": 1200.50
}
```

**Response:** (200 OK)
```json
{
  "transactionExternalId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "transactionType": {
    "name": "1"
  },
  "transactionStatus": {
    "name": "PENDING"
  },
  "value": 1200.5,
  "createdAt": "2026-03-01T00:00:00.00000"
}
```
*(Notice: Since `1200.5 > 1000`, the Anti-Fraud Service will immediately pick up the event backing this response and update the status to `REJECTED` in the database).*

### 2. Retrieve a Transaction
Consulta el estado final de tu transacción. Para cuando la consultes, el flujo asíncrono de Kafka ya debería haber procesado el evento.

**Endpoint:** `GET /api/transactions/{transactionExternalId}`

**Response:** (200 OK)
```json
{
  "transactionExternalId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "transactionType": {
    "name": "1"
  },
  "transactionStatus": {
    "name": "REJECTED"
  },
  "value": 1200.5,
  "createdAt": "2026-03-01T00:00:00.00000"
}
```
## GraphQL
Si prefieres realizar consultas mediante GraphQL, utiliza el endpoint `http://localhost:8080/graphiql`.

**Query:**
```graphql
query GetTransaction($id: String!) {
  getTransaction(transactionExternalId: $id) {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```

**Variables:**
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

**Response:**
```json
{
  "data": {
    "getTransaction": {
      "transactionExternalId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "transactionType": { "name": "1" },
      "transactionStatus": { "name": "REJECTED" },
      "value": 1200.5,
      "createdAt": "2026-03-01T00:00:00.00000"
    }
  }
}
```
```
**Mutations:**
```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    transactionExternalId
    transactionType {
      name
    }
    transactionStatus {
      name
    }
    value
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "accountExternalIdCredit": "8f285f64-5717-4562-b3fc-2c963f66afa7",
    "tranferTypeId": 1,
    "value": 1200.50
  }
}
```

**Response:**
```json
{
  "data": {
    "createTransaction": {
      "transactionExternalId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "transactionType": { "name": "1" },
      "transactionStatus": { "name": "PENDING" },
      "value": 1200.5,
      "createdAt": "2026-03-01T00:00:00.00000"
    }
  }
}
```
```

## 💡 About High Volume Scenarios
La arquitectura **Event-Driven + WebFlux** adoptada resuelve de forma nativa el desafío de los "Escenarios de Alto Volumen":
- **Resiliencia en Escritura (Write-Heavy)**: La solicitud HTTP no espera la validación antifraude. Simplemente envía el evento a través de R2DBC+Kafka y retorna exitosamente. Kafka actúa como un buffer masivo, absorbiendo miles de eventos concurrentes sin bloquear la aplicación.
- **Segregación Lectura/Escritura (Fundamentos CQRS)**: Actualmente, tanto la lectura como la escritura aprovechan intensamente la E/S no bloqueante. Para escenarios de lectura extrema, una capa de caché (como Redis) y una API GraphQL podrían integrarse fácilmente sobre esta arquitectura.
- **Escalabilidad Horizontal**: Cada microservicio puede instanciarse/escalarse múltiples veces en un clúster de Kubernetes; los Grupos de Consumidores de Kafka manejan la distribución de carga de forma nativa.
