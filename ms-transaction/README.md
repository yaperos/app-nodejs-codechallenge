# Transaction Service 💳

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2+-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-3.6+-black.svg)](https://kafka.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Microservicio de gestión de transacciones financieras con integración anti-fraude mediante arquitectura orientada a eventos.


## 🎯 Descripción

Transaction Service es un microservicio diseñado para manejar transacciones financieras con validación anti-fraude en tiempo real. Implementa arquitectura hexagonal (puertos y adaptadores) para garantizar un dominio limpio y desacoplado de la infraestructura.

### Flujo Principal

1. Cliente crea una transacción mediante API REST
2. Transacción se guarda con estado `PENDING`
3. Evento se publica en Kafka (`transaction.created`)
4. Anti-Fraud Service evalúa la transacción
5. Resultado se recibe vía Kafka (`transaction.approved` o `transaction.rejected`)
6. Estado de la transacción se actualiza a `APPROVED` o `REJECTED`

## 🏗️ Arquitectura

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────┐
│              INFRASTRUCTURE                     │
│  ┌──────────────┐         ┌──────────────┐      │
│  │   REST API   │         │    Kafka     │      │
│  │  (Adapter)   │         │  (Adapter)   │      │
│  └──────┬───────┘         └──────┬───────┘      │
│         │                        │              │
│    ┌────▼────────────────────────▼────┐         │
│    │      APPLICATION LAYER            │        │
│    │    (Use Cases / Services)         │        │
│    └────┬────────────────────────┬────┘         │
│         │                        │              │
│    ┌────▼────────────────────────▼────┐         │
│    │         DOMAIN LAYER              │        │
│    │   (Business Logic & Rules)        │        │
│    └────┬────────────────────────┬────┘         │
│         │                        │              │
│  ┌──────▼───────┐         ┌──────▼───────┐      │
│  │  PostgreSQL  │         │    Kafka     │      │
│  │  (Adapter)   │         │  (Adapter)   │      │
│  └──────────────┘         └──────────────┘      │
└─────────────────────────────────────────────────┘
```

### Integración con Anti-Fraud Service

```
┌──────────────────┐                    ┌──────────────────┐
│   Transaction    │                    │   Anti-Fraud     │
│     Service      │                    │     Service      │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         │  1. transaction.created               │
         ├──────────────────────────────────────►│
         │                                       │
         │                                  2. Evaluate
         │                                       │
         │  3. transaction.approved/rejected     │
         │◄──────────────────────────────────────┤
         │                                       │
    4. Update                                    │
    Transaction                                  │
      Status                                     │
```

## ✨ Características

- ✅ **Arquitectura Hexagonal** - Dominio desacoplado de infraestructura
- ✅ **Event-Driven Architecture** - Comunicación asíncrona vía Apache Kafka
- ✅ **API REST** - Endpoints para crear y consultar transacciones
- ✅ **Validación Anti-Fraude** - Integración en tiempo real
- ✅ **Estados de Transacción** - PENDING, APPROVED, REJECTED
- ✅ **Persistencia** - PostgreSQL con JPA/Hibernate
- ✅ **Idempotencia** - Kafka con exactly-once semantics

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Java | 17+     | Lenguaje principal |
| Spring Boot | 4.0.x   | Framework de aplicación |
| Spring Data JPA |         | Capa de persistencia |
| Apache Kafka |         | Message broker |
| PostgreSQL |         | Base de datos |
| Maven | 3.9+    | Gestión de dependencias |


## 📁 Estructura del Proyecto

```
ms-transaction/
│
├── src/
│   ├── main/
│   │   ├── java/pe/com/yape/transaction/
│   │   │   │
│   │   │   ├── domain/                          # Capa de Dominio
│   │   │   │   ├── model/                       # Entidades y Value Objects
│   │   │   │   │   ├── Transaction.java
│   │   │   │   │   ├── TransactionStatus.java
│   │   │   │   │   └── valueobjects/
│   │   │   │   │       ├── TransactionId.java
│   │   │   │   │       ├── AccountExternalId.java
│   │   │   │   │       ├── Amount.java
│   │   │   │   │       └── TransferTypeId.java
│   │   │   │   │
│   │   │   │   ├── ports/                       # Interfaces (Puertos)
│   │   │   │   │   ├── in/                      # Casos de uso
│   │   │   │   │   │   ├── CreateTransactionUseCase.java
│   │   │   │   │   │   ├── GetTransactionUseCase.java
│   │   │   │   │   │   └── UpdateTransactionStatusUseCase.java
│   │   │   │   │   │
│   │   │   │   │   └── out/                     # Puertos de salida
│   │   │   │   │       ├── TransactionRepositoryPort.java
│   │   │   │   │       └── EventPublisherPort.java
│   │   │   │   │
│   │   │   │   ├── events/                      # Eventos de dominio
│   │   │   │   │   ├── TransactionCreatedEvent.java
│   │   │   │   │   ├── TransactionApprovedEvent.java
│   │   │   │   │   └── TransactionRejectedEvent.java
│   │   │   │   │
│   │   │   │   └── exceptions/                  # Excepciones del dominio
│   │   │   │       ├── TransactionNotFoundException.java
│   │   │   │       ├── InvalidAmountException.java
│   │   │   │       └── InvalidTransactionStateException.java
│   │   │   │
│   │   │   ├── application/                     # Capa de Aplicación
│   │   │   │   └── usecases/                    # Implementación casos de uso
│   │   │   │       ├── CreateTransactionUseCaseImpl.java
│   │   │   │       ├── GetTransactionUseCaseImpl.java
│   │   │   │       └── UpdateTransactionStatusUseCaseImpl.java
│   │   │   │
│   │   │   └── infrastructure/                  # Capa de Infraestructura
│   │   │       │
│   │   │       ├── adapter/
│   │   │       │   ├── in/                      # Adaptadores de entrada
│   │   │       │   │   ├── rest/                # REST API
│   │   │       │   │   │   ├── TransactionController.java
│   │   │       │   │   │   └──mapper/
│   │   │       │   │   │   │   └── TransactionDtoMapper.java
│   │   │       │   │   │   └── dto/
│   │   │       │   │   │       ├── CreateTransactionRequest.java
│   │   │       │   │   │       ├── TransactionResponse.java
│   │   │       │   │   │       └── TransactionStatusDto.java
│   │   │       │   │   │       └── TransactionTypeDto.java
│   │   │       │   │   │
│   │   │       │   │   └── messaging/           # Kafka Consumer
│   │   │       │   │       └── kafka/
│   │   │       │   │           ├── KafkaTransactionConsumer.java
│   │   │       │   │           └── dto/
│   │   │       │   │               └── TransactionStatusEventDto.java
│   │   │       │   │
│   │   │       │   └── out/                     # Adaptadores de salida
│   │   │       │       ├── persistence/         # Base de datos
│   │   │       │       │   └── postgresql/
│   │   │       │       │       ├── TransactionPostgresAdapter.java
│   │   │       │       │       ├── entity/
│   │   │       │       │       │   └── TransactionEntity.java
│   │   │       │       │       ├── repository/
│   │   │       │       │       │   └── TransactionJpaRepository.java
│   │   │       │       │       └── mapper/
│   │   │       │       │           └── TransactionEntityMapper.java
│   │   │       │       │
│   │   │       │       └── messaging/           # Kafka Producer
│   │   │       │           └── kafka/
│   │   │       │               ├── KafkaEventPublisher.java
│   │   │       │               └── dto/
│   │   │       │                   └── TransactionEventDto.java
│   │   │       │
│   │   │       └── config/                      # Configuraciones
│   │   │           └── KafkaTopicsConfig.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml                  # Configuración principal
│   │
│   └── test/                                    # Tests
│       └── java/.../transaction/
│           ├── domain/
│           ├── application/
│           └── infrastructure/
├── pom.xml
└── README.md
```

## 📋 Prerequisitos

- **JDK 17+** - [Descargar](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.9+** - [Descargar](https://maven.apache.org/download.cgi)
- **Docker & Docker Compose** - [Descargar](https://www.docker.com/products/docker-desktop)
- **PostgreSQL 15+** (opcional si usas Docker)
- **Apache Kafka 3.6+** (opcional si usas Docker)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-org/transaction-service.git
cd transaction-service
```

### 2. Levantar infraestructura con Docker

```bash
# Iniciar PostgreSQL y Kafka
docker-compose up -d postgres kafka zookeeper

# Verificar que estén corriendo
docker-compose ps
```

### 3. Compilar el proyecto

```bash
# Limpiar y compilar
mvn clean install
```

### 4. Ejecutar la aplicación

```bash
# Perfil desarrollo
mvn spring-boot:run -Dspring.profiles.active=dev

# O con Java
java -jar target/ms-transaction-1.0.0.jar --spring.profiles.active=dev
```

La aplicación estará disponible en: `http://localhost:8080`


## 💻 Uso

### Crear una Transacción

```bash
curl -X POST http://localhost:8080/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "transferTypeId": 1,
    "value": 500.00
  }'
```

**Respuesta:**

```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "transactionType": {
    "name": "Transfer Type 1"
  },
  "transactionStatus": {
    "name": "pending"
  },
  "value": 500.00,
  "createdAt": "2026-01-06T10:30:00"
}
```

### Consultar una Transacción

```bash
curl http://localhost:8080/api/v1/transactions/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta:**

```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "transactionType": {
    "name": "Transfer Type 1"
  },
  "transactionStatus": {
    "name": "approved"
  },
  "value": 500.00,
  "createdAt": "2026-01-06T10:30:00"
}
```

## 🔌 API Endpoints

### Transacciones

| Método | Endpoint | Descripción | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/v1/transactions` | Crear transacción | [CreateTransactionRequest](#crear-transacción) | [TransactionResponse](#respuesta) |
| `GET` | `/api/v1/transactions/{id}` | Obtener transacción | - | [TransactionResponse](#respuesta) |


## 📨 Eventos de Kafka

### Topic: `transaction.created`

**Producer:** Transaction Service  
**Consumer:** Anti-Fraud Service

```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "value": 1500.00
}
```

### Topic: `transaction.approved`

**Producer:** Anti-Fraud Service  
**Consumer:** Transaction Service

```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "approved"
}
```

### Topic: `transaction.rejected`

**Producer:** Anti-Fraud Service  
**Consumer:** Transaction Service

```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "rejected"
}
```

## 🗄️ Base de Datos

### Diagrama ER

```
┌────────────────────────────────────────┐
│         transactions                   │
├────────────────────────────────────────┤
│ id (PK)                                │
│ transaction_external_id (UNIQUE)       │
│ account_external_id_debit              │
│ account_external_id_credit             │
│ transfer_type_id                       │
│ value                                  │
│ status                                 │
│ created_at                             │
│ updated_at                             │
│ version                                │
└────────────────────────────────────────┘
```

### Estados de Transacción

| ID | Status | Descripción |
|----|--------|-------------|
| 1 | pending | Transacción pendiente de validación |
| 2 | approved | Transacción aprobada por anti-fraude |
| 3 | rejected | Transacción rechazada por anti-fraude |

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026  
**Estado:** En desarrollo activo