# Reto Técnico - Sistema de Transacciones con Validación Anti-Fraude

Sistema de microservicios que gestiona transacciones financieras con validación anti-fraude asíncrona mediante Kafka, implementado con arquitectura hexagonal y patrón CQRS.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Java 21 | Lenguaje |
| Spring Boot 3.4.2 | Framework |
| PostgreSQL 16 | Base de datos (modelo de escritura) |
| Redis 7 | Cache (modelo de lectura - CQRS) |
| Apache Kafka | Mensajería entre microservicios |
| Docker Compose | Infraestructura local |
| Maven Multi-Módulo | Gestión del proyecto |
| Arquitectura Hexagonal | Separación de responsabilidades |

## Estructura del Proyecto

```
reto-tecnico/
├── pom.xml                      (POM padre)
├── docker-compose.yml           (PostgreSQL + Redis + Kafka + Zookeeper)
├── common/                      (Módulo compartido - eventos Kafka)
├── transaction-service/         (Microservicio de transacciones - puerto 8080)
└── anti-fraud-service/          (Microservicio anti-fraude - puerto 8081)
```

## Requisitos Previos

- Java 21
- Maven 3.9+
- Docker Desktop

## Despliegue

### 1. Levantar infraestructura con Docker

```bash
docker-compose up -d
```

Esto levanta:
- **PostgreSQL** en `localhost:5432` (base de datos `transactions_db`)
- **Redis** en `localhost:6379`
- **Kafka** en `localhost:9092`
- **Zookeeper** en `localhost:2181`

Verificar que todo esté corriendo:

```bash
docker-compose ps
```

### 2. Compilar el proyecto

```bash
./mvnw clean install -DskipTests
```

### 3. Levantar los microservicios

En una terminal, levantar el servicio de transacciones:

```bash
./mvnw -pl transaction-service spring-boot:run
```

En otra terminal, levantar el servicio anti-fraude:

```bash
./mvnw -pl anti-fraud-service spring-boot:run
```

### 4. Detener todo

```bash
# Detener microservicios: Ctrl+C en cada terminal

# Detener infraestructura Docker
docker-compose down
```

---

## Endpoints

### POST /api/transactions — Crear transacción

**Request:**

```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "tranferTypeId": 1,
    "value": 120
  }'
```

**Response (201 Created):**

```json
{
  "transactionExternalId": "fb443c94-1206-4578-a953-c8a543bc666b",
  "transactionType": {
    "name": "Transfer"
  },
  "transactionStatus": {
    "name": "pending"
  },
  "value": 120,
  "createdAt": "2026-02-28T14:26:41.250"
}
```

### GET /api/transactions/{transactionExternalId} — Consultar transacción

**Request:**

```bash
curl http://localhost:8080/api/transactions/fb443c94-1206-4578-a953-c8a543bc666b
```

**Response (200 OK):**

```json
{
  "transactionExternalId": "fb443c94-1206-4578-a953-c8a543bc666b",
  "transactionType": {
    "name": "Transfer"
  },
  "transactionStatus": {
    "name": "approved"
  },
  "value": 120,
  "createdAt": "2026-02-28T14:26:41.250"
}
```

> **Nota:** El estado cambia de `pending` a `approved` o `rejected` de forma asíncrona mediante Kafka tras la validación del servicio anti-fraude.

---

## Regla de Negocio

- Transacciones con `value <= 1000` → **approved**
- Transacciones con `value > 1000` → **rejected**

---

## Flujo Completo

```
1. Cliente hace POST /api/transactions (value=120)
   │
   ▼
2. TransactionController recibe el request
   │
   ▼
3. CreateTransactionService orquesta:
   ├── Transaction.create()              → Crea entidad con status=PENDING
   ├── JpaTransactionRepositoryAdapter   → Guarda en PostgreSQL
   ├── RedisTransactionCacheAdapter      → Guarda en Redis (CQRS)
   └── KafkaTransactionPublisher         → Publica en topic "transaction-created"
   │
   └── Respuesta al cliente: { status: "pending" }

        ⚡ KAFKA (automático) ⚡

4. Anti-Fraud Service:
   ├── KafkaFraudConsumer                ← Consume "transaction-created"
   ├── FraudValidationService            → Evalúa regla de negocio
   ├── FraudValidation.validate()        → 120 > 1000? NO → APPROVED
   └── KafkaFraudResultPublisher         → Publica en topic "transaction-status"

        ⚡ KAFKA (automático) ⚡

5. Transaction Service (de vuelta):
   ├── KafkaTransactionStatusConsumer    ← Consume "transaction-status"
   └── UpdateTransactionStatusService
       ├── PostgreSQL                    → UPDATE status = APPROVED
       └── Redis                         → UPDATE status = APPROVED

6. Cliente hace GET /api/transactions/{id}
   │
   ▼
7. GetTransactionService:
   ├── Redis (cache hit?)  → SÍ → Devuelve { status: "approved" }
   └── PostgreSQL (si no está en cache) → Devuelve y repobla cache
```

## Arquitectura Hexagonal

Cada microservicio sigue la estructura de puertos y adaptadores:

```
domain/
├── model/          → Entidades de dominio (sin dependencias de frameworks)
└── port/
    ├── in/         → Puertos de entrada (casos de uso)
    └── out/        → Puertos de salida (interfaces de persistencia, mensajería, cache)

application/
├── service/        → Implementación de los casos de uso
├── dto/            → Objetos de transferencia de datos
└── exception/      → Manejo global de errores

infrastructure/
├── adapter/
│   ├── in/rest/          → Controladores REST
│   └── out/
│       ├── persistence/  → Adaptador JPA (PostgreSQL)
│       ├── messaging/    → Adaptador Kafka (productor/consumidor)
│       └── cache/        → Adaptador Redis (CQRS)
└── config/               → Configuraciones (Kafka, Redis, Jackson)
```

## CQRS (Command Query Responsibility Segregation)

- **Escritura (Command):** PostgreSQL es la fuente de verdad para todas las operaciones de escritura.
- **Lectura (Query):** Redis actúa como modelo de lectura optimizado. Las consultas GET buscan primero en Redis (~0.1ms) y solo van a PostgreSQL como fallback (~5ms).
- **Sincronización:** Cada vez que se escribe o actualiza una transacción en PostgreSQL, también se actualiza Redis.
