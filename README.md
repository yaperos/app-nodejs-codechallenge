# 🧾 Financial Transactions Platform (Microservices)

Este proyecto es una plataforma de ejemplo basada en **arquitectura de microservicios**, diseñada para manejar **transacciones financieras**, validarlas mediante un servicio de **detección de fraude**, y coordinar la comunicación entre servicios usando **Kafka**.

El objetivo principal es demostrar buenas prácticas en:
- NestJS
- Clean / Modular Architecture
- GraphQL + REST
- Kafka (event-driven)
- PostgreSQL
- Docker & Docker Compose
- Testing con Jest

---

## 🧱 Arquitectura General

El sistema está compuesto por los siguientes servicios:

┌──────────────────────────┐
│ ms-financial-transaction │
│--------------------------│
│ GraphQL API │
│ PostgreSQL │
│ Kafka Producer │
│ Kafka Consumer │
└─────────┬────────────────┘
│
▼
┌───────────────────────┐
│ ms-fraud-detection │
│-----------------------│
│ Kafka Consumer │
│ Kafka Producer │
│ Lógica antifraude │
└───────────────────────┘


---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 20**
- **NestJS**
- **TypeScript**
- **GraphQL (Apollo)**

### Persistencia
- **PostgreSQL**
- **TypeORM**

### Mensajería / Eventos
- **Apache Kafka**
- **Zookeeper**
- Imágenes Confluent:
  - `confluentinc/cp-zookeeper:5.5.3`
  - `confluentinc/cp-enterprise-kafka:5.5.3`

### Observabilidad
- **Pino / nestjs-pino** (logging estructurado)

### Testing
- **Jest**
- **Unit Tests** para:
  - Use cases
  - Services
  - Kafka producers / consumers
  - Repositories (mockeados)

### Infraestructura
- **Docker**
- **Docker Compose**


---

## 📦 Microservicios

### 🔹 ms-financial-transaction
Responsabilidades:
- Exponer API GraphQL para crear y consultar transacciones
- Persistir transacciones en PostgreSQL
- Publicar evento `financial.transaction.created`
- Consumir evento `financial.transaction.update` para actualizar estado

### 🔹 ms-fraud-detection
Responsabilidades:
- Consumir evento `financial.transaction.created`
- Evaluar reglas antifraude (ej. monto > 1000)
- Publicar evento `financial.transaction.update`

---

## ✅ Requisitos Previos

Antes de levantar el proyecto asegúrate de tener:

- **Docker Desktop** (recomendado con al menos 4GB de RAM asignados)
- **Docker Compose v2**
- **Git**

Versiones recomendadas:
- Docker ≥ 24.x
- Node.js ≥ 20 (solo si ejecutas servicios fuera de Docker)

---

## 🚀 Cómo levantar TODO el proyecto

### Clonar el repositorio

```bash
git clone <repo-url>
cd <repo-name>

### Reemplazar el nombre de los archivos .env.example por solo .env

```bash
.env.example  -> .env
ms-financial-transaction/.env.example -> ms-financial-transaction/.env
ms-fraud-detection/.env.example -> ms-fraud-detection/.env

### Levantar todos los servicios

```bash
docker compose up -d --build

⏳ La primera vez puede tardar entre 5 y 10 minutos, especialmente por Kafka.

## 🧩 Acceso al GraphQL Playground

Una vez levantados los servicios con Docker:

```bash
http://localhost:3000/graphql


### Desde aquí puedes ejecutar queries y mutations.

---

## ✏️ Crear una transacción

### Mutation GraphQL

```graphql
mutation {
  createTransaction(
    input: {
      amount: 1500
      transferType: "DEBIT"
      accountExternalIdDebit: "acc-debit-001"
      accountExternalIdCredit: "acc-credit-001"
    }
  ) {
    id
    amount
    createdAt
  }
}

## ✏️ Consultar una transacción por id

### Query GraphQL

```graphql
query {
  getTransactionById(
    id: "793357d8-6e3a-4952-9d47-5ec926e1f5c7"
  ) {
    transactionExternalId
    value
    transactionType {
        name
    }
    transactionStatus {
        name
    }
    createdAt
  }
}


### Ejemplo Respuesta

```graphql
{
    "data": {
        "getTransactionById": {
            "transactionExternalId": "793357d8-6e3a-4952-9d47-5ec926e1f5c7",
            "value": 505,
            "transactionType": {
                "name": "CREDIT"
            },
            "transactionStatus": {
                "name": "APPROVED"
            },
            "createdAt": "19/12/2025, 10:46:10 a. m."
        }
    }
}

---

## 🚀 Futuras mejoras y extensiones del proyecto

Este proyecto fue diseñado con una arquitectura modular y desacoplada, lo que permite escalar y evolucionar fácilmente. A continuación se listan mejoras recomendadas para un entorno productivo.

---

## 🔐 Seguridad

### Autenticación y autorización
- Implementar **JWT** para proteger el acceso al API GraphQL
- Uso de **guards** en NestJS
- Roles y permisos (admin, system, service)

## 🌐 API Gateway

- Centralizar acceso a los microservicios
- Manejo de:
  - Rate limiting
  - Autenticación
  - Versionado


## 📦 Contratos de eventos (Event Contracts)

Formalizar los mensajes Kafka usando:
- **Schema Registry**
- Avro / JSON Schema / Protobuf

---

## 🔁 Retries y Dead Letter Topics (DLT)

Mejorar la resiliencia del sistema:

- Retry automático en consumers Kafka
- Dead Letter Topic para mensajes fallidos
- Backoff exponencial

## 🧪 Testing avanzado

- Pruebas de integración
- Manejo de cobertura de código

## ⚙️ Configuración y secretos

- Centralizar configuración con:
  - Vault
  - Kubernetes Secrets

## ✍️ Autor

**Diego Cayetano** 

📍 Perú  
💼 Backend Developer  
