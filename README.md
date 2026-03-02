# Reto Yape

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                     transaction-service                          │
│                                                                  │
│  REST API  ──►  CreateTransactionUseCase  ──►  DB (PENDING)     │
│                          │                                       │
│                          └──► Kafka: transaction.created        │
│                                                                  │
│  Kafka Consumer ◄── transaction.status.updated                  │
│          │                                                       │
│          └──► UpdateTransactionStatusUseCase ──► DB (update)    │
└─────────────────────────────────────────────────────────────────┘
                              ▲ │
                              │ ▼ Kafka
┌─────────────────────────────────────────────────────────────────┐
│                     anti-fraud-service                           │
│                                                                  │
│  Kafka Consumer ◄── transaction.created                         │
│          │                                                       │
│          └──► EvaluateTransactionUseCase                        │
│                  value > 1000 → REJECTED                        │
│                  value ≤ 1000 → APPROVED                        │
│                          │                                       │
│                          └──► Kafka: transaction.status.updated │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura de paquetes - Arquitectura Hexagonal

```
src/main/java/com/yape/transaction/
├── domain/
│   ├── model/                    # Entidades y Value Objects (núcleo del dominio)
│   │   ├── Transaction.java
│   │   ├── TransactionStatus.java
│   │   └── TransactionType.java
│   └── port/
│       ├── in/                   # Casos de uso (interfaces de entrada)
│       │   ├── CreateTransactionUseCase.java
│       │   ├── GetTransactionUseCase.java
│       │   └── UpdateTransactionStatusUseCase.java
│       └── out/                  # Puertos de salida (contratos de infraestructura)
│           ├── TransactionRepository.java
│           └── TransactionEventPublisher.java
├── application/
│   └── usecase/                  # Implementaciones de casos de uso
│       ├── CreateTransactionService.java
│       ├── GetTransactionService.java
│       └── UpdateTransactionStatusService.java
└── infrastructure/
    ├── adapter/
    │   ├── in/
    │   │   ├── rest/             # Controllers REST (adaptador de entrada)
    │   │   └── messaging/        # Kafka consumers (adaptador de entrada)
    │   └── out/
    │       ├── persistence/      # JPA adapters (adaptador de salida)
    │       └── messaging/        # Kafka producers (adaptador de salida)
    └── config/                   # Configuración de Spring / Kafka
```

## Cómo levantar el proyecto

### Prerrequisitos
- Docker & Docker Compose
- Java 17+
- Maven 3.9+

### Levantar infraestructura + servicios
```bash
docker-compose up -d
```

### Solo infraestructura (para desarrollo local)
```bash
docker-compose up -d postgres kafka zookeeper kafka-ui
```

### Ejecutar servicios localmente
```bash
# Terminal 1 - Transaction Service
cd transaction-service
mvn spring-boot:run

# Terminal 2 - Anti-Fraud Service
cd anti-fraud-service
mvn spring-boot:run
```

## API Endpoints

### Crear transacción
```http
POST http://localhost:8080/api/v1/transactions
Content-Type: application/json

{
  "accountExternalIdDebit": "3a0c1b2d-4e5f-6789-abcd-ef0123456789",
  "accountExternalIdCredit": "7f8e9d0c-1b2a-3456-789a-bcdef0123456",
  "tranferTypeId": 1,
  "value": 120
}
```

### Recuperar transacción
```http
GET http://localhost:8080/api/v1/transactions/{transactionExternalId}
```

### Respuesta esperada
```json
{
  "transactionExternalId": "uuid",
  "transactionType": { "name": "Transfer" },
  "transactionStatus": { "name": "APPROVED" },
  "value": 120,
  "createdAt": "2024-01-15T10:30:00"
}
```

## Tópicos Kafka

| Tópico                        | Publicado por         | Consumido por         |
|-------------------------------|-----------------------|-----------------------|
| `transaction.created`         | transaction-service   | anti-fraud-service    |
| `transaction.status.updated`  | anti-fraud-service    | transaction-service   |

## Reglas de negocio

- Toda transacción inicia con estado **PENDING**
- Anti-fraud aprueba si `value <= 1000`
- Anti-fraud rechaza si `value > 1000`

## Tests

```bash
# Transaction service
cd transaction-service && mvn test

# Anti-fraud service
cd anti-fraud-service && mvn test
```
