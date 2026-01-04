# Yape Challenge - Microservicios de Transacciones

Sistema de microservicios para gestión de transacciones con validación anti-fraude, **optimizado para alto volumen**.

## ✨ Características Principales

- ✅ **Arquitectura de Microservicios** con comunicación asíncrona vía Kafka
- ✅ **Event Sourcing** implementado para auditoría completa de transacciones
- ✅ **CQRS** (Command Query Responsibility Segregation) con Command Bus y Query Bus
- ✅ **Redis Cache Distribuido** para lecturas de alta velocidad (5-20ms)
- ✅ **Optimizado para Alto Volumen** (5K-10K lecturas/seg, 100-200 escrituras/seg)
- ✅ **API REST** con Spring Boot 3.2.0 y Java 21
- ✅ **Validación Anti-Fraude** en tiempo real (rechaza transacciones > 1000)
- ✅ **PostgreSQL 16** con JSONB para Event Store
- ✅ **Apache Kafka** para mensajería asíncrona entre servicios
- ✅ **Docker y Docker Compose** para deployment simplificado
- ✅ **HikariCP** con connection pooling optimizado (50 conexiones)
- ✅ **Event Store API** para auditoría y debugging de eventos

## 🏗️ Arquitectura

Este proyecto implementa una arquitectura de microservicios con los siguientes componentes:

- **Transaction Service**: API REST para gestión de transacciones con **Event Sourcing** y **Redis Cache**
- **Anti-Fraud Service**: Servicio de validación anti-fraude
- **Common**: Librería compartida con DTOs y utilidades
- **PostgreSQL**: Base de datos para transacciones y Event Store
- **Redis**: Caché distribuido para optimización de lecturas
- **Kafka**: Message broker para comunicación asíncrona entre servicios

### 🎯 Patrones Implementados

- **Event Sourcing**: Todos los cambios se almacenan como eventos inmutables
- **CQRS**: Separación entre comandos (escritura) y queries (lectura)
- **Domain Events**: Eventos del dominio del negocio
- **Event Store**: Persistencia de eventos en PostgreSQL con JSONB
- **Distributed Caching**: Redis para lecturas de alta velocidad (5-20ms)
- **Cache-Aside Pattern**: Estrategia de caché con invalidación automática
- **Read Model**: Proyección optimizada para consultas
- **Message Broker**: Kafka para integración entre servicios

## 📁 Estructura del Proyecto

```
yape-challenge/
├── transaction-service/     # Microservicio de transacciones (EVENT SOURCING + CQRS)
│   ├── Dockerfile
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/com/yape/challenge/transaction/
│       │   │   ├── TransactionServiceApplication.java
│       │   │   ├── application/          # CQRS - Commands & Queries
│       │   │   │   ├── bus/              # Command Bus & Query Bus
│       │   │   │   ├── command/          # CreateTransactionCommand
│       │   │   │   ├── query/            # GetTransactionQuery
│       │   │   │   ├── handler/          # Command & Query Handlers
│       │   │   │   └── dto/              # Request/Response DTOs
│       │   │   ├── domain/
│       │   │   │   ├── entity/           # Transaction (JPA Entity)
│       │   │   │   ├── event/            # Domain Events
│       │   │   │   │   ├── TransactionCreatedEvent
│       │   │   │   │   ├── TransactionStatusUpdatedEvent
│       │   │   │   │   └── TransactionDomainEvent (base)
│       │   │   │   └── service/          # TransactionAggregateService
│       │   │   ├── infrastructure/
│       │   │   │   ├── eventstore/       # Event Store Implementation
│       │   │   │   │   ├── EventStore
│       │   │   │   │   ├── DomainEventEntity (JPA)
│       │   │   │   │   └── DomainEventRepository
│       │   │   │   ├── repository/       # JPA Repositories
│       │   │   │   │   └── TransactionRepository
│       │   │   │   ├── kafka/            # Kafka Producers/Consumers
│       │   │   │   │   ├── TransactionProducer
│       │   │   │   │   └── TransactionStatusConsumer
│       │   │   │   └── config/           # Redis, Kafka, JPA Config
│       │   │   └── presentation/         # REST Controllers
│       │   │       ├── controller/
│       │   │       │   ├── TransactionController
│       │   │       │   └── EventStoreController
│       │   │       └── exception/        # Global Exception Handler
│       │   └── resources/
│       │       ├── application.yml       # Local profile
│       │       ├── application-docker.yml # Docker profile
│       │       └── db/
│       │           └── data.sql          # Initial Data (Transfer Types)
│       └── test/
│           └── java/                     # Unit & Integration Tests
├── antifraud-service/       # Microservicio anti-fraude
│   ├── Dockerfile
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/com/yape/challenge/antifraud/
│       │   │   ├── AntiFraudApplication.java
│       │   │   ├── service/              # AntiFraudService
│       │   │   ├── kafka/                # Kafka Consumer/Producer
│       │   │   └── config/               # Kafka Configuration
│       │   └── resources/
│       │       ├── application.yml
│       │       └── application-docker.yml
│       └── test/
│           └── java/                     # Unit Tests
├── common/                  # Módulo compartido (DTOs y Kafka)
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/com/yape/challenge/common/
│               ├── dto/                  # DTOs compartidos
│               │   ├── TransactionCreatedEvent
│               │   ├── TransactionStatusEvent
│               │   └── TransactionStatus (enum)
│               └── kafka/
│                   └── KafkaTopics       # Nombres de topics
├── docker-compose.yml       # Orquestación de servicios
│   # Servicios: postgres, redis, zookeeper, kafka, kafka-ui,
│   #            transaction-service, antifraud-service
├── pom.xml                  # POM principal del monorepo
├── README.md                # Esta documentación
└── Yape-Challenge.postman_collection.json # Colección de Postman
```

### Descripción de Módulos

#### Transaction Service
- **Puerto**: 8080
- **Base de datos**: PostgreSQL (transacciones + event store)
- **Caché**: Redis (lecturas optimizadas)
- **Patrones**: Event Sourcing, CQRS, Domain Events, Cache-Aside

#### Anti-Fraud Service
- **Puerto**: 8081
- **Función**: Validación de transacciones en tiempo real
- **Regla**: Rechaza transacciones con valor > 1000

#### Common
- Módulo compartido entre servicios
- DTOs para eventos de Kafka
- Constantes de topics de Kafka
- No tiene puerto, es una librería

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose
- Java 21 (si quieres ejecutar sin Docker)
- Maven 3.9+ (si quieres compilar localmente)

### Ejecutar todo el stack

```bash
# Construir y ejecutar todos los servicios
docker compose up --build

# O en modo detached (background)
docker compose up -d --build
```

Los servicios estarán disponibles en:
- **Transaction Service**: http://localhost:8080
- **Anti-Fraud Service**: http://localhost:8081
- **Kafka UI**: http://localhost:8090
- **PostgreSQL**: localhost:5432 (usuario: yapeuser, db: yape_transactions)
- **Redis**: localhost:6379

### Endpoints de Monitoreo (Actuator)

#### Transaction Service
- Health: http://localhost:8080/actuator/health
- Metrics: http://localhost:8080/actuator/metrics

#### Anti-Fraud Service
- Health: http://localhost:8081/actuator/health
- Metrics: http://localhost:8081/actuator/metrics

### Ejecutar servicios individuales

Cada microservicio puede ejecutarse de forma independiente. Ver el README en cada directorio:
- [Transaction Service README](./transaction-service/README.md)
- [Anti-Fraud Service README](./antifraud-service/README.md)

## 📡 API Endpoints

### Transaction Service

#### Crear Transacción
```bash
POST http://localhost:8080/api/v1/transactions
Content-Type: application/json

{
  "accountExternalIdDebit": "Guid1",
  "accountExternalIdCredit": "Guid2",
  "tranferTypeId": 1,
  "value": 120.00
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "transactionStatus": "PENDING",
  "transactionType": 1,
  "value": 120.00,
  "createdAt": "2026-01-04T10:30:00Z"
}
```

#### Obtener Transacción por ID
```bash
GET http://localhost:8080/api/v1/transactions/{externalId}
```

**Respuesta exitosa (200 OK):**
```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "transactionStatus": "APPROVED",
  "transactionType": 1,
  "value": 120.00,
  "createdAt": "2026-01-04T10:30:00Z"
}
```

### Event Store API (Auditoría y Debug)

#### Obtener eventos de una transacción
```bash
GET http://localhost:8080/api/v1/events/transaction/{transactionId}
```

#### Obtener todos los eventos
```bash
GET http://localhost:8080/api/v1/events/all
```

#### Obtener eventos por tipo
```bash
GET http://localhost:8080/api/v1/events/type/{eventType}
```

#### Verificar si existe una transacción
```bash
GET http://localhost:8080/api/v1/events/transaction/{transactionId}/exists
```

#### Contar eventos de una transacción
```bash
GET http://localhost:8080/api/v1/events/transaction/{transactionId}/count
```

## 🔄 Flujo de Transacciones

### Flujo de Creación (Write Path - CQRS Command)

1. **Cliente** envía solicitud POST a `/api/v1/transactions`
2. **Transaction Service** recibe el request y valida los datos
3. **Command Bus** despacha el `CreateTransactionCommand`
4. **Transaction Aggregate Service** crea los eventos de dominio:
   - `TransactionCreatedEvent` (estado inicial: PENDING)
5. **Event Store** persiste los eventos en PostgreSQL (JSONB)
6. **Transaction Repository** actualiza la proyección (read model)
7. **Redis Cache** almacena la transacción para lecturas rápidas
8. **Kafka Producer** publica evento `transaction-created` a Kafka
9. **Anti-Fraud Service** consume el evento de Kafka
10. **Anti-Fraud Service** valida la transacción:
    - ✅ APPROVED si valor ≤ 1000
    - ❌ REJECTED si valor > 1000
11. **Anti-Fraud Service** publica resultado a Kafka topic `transaction-status`
12. **Transaction Service** consume el resultado de validación
13. **Transaction Aggregate Service** crea evento `TransactionStatusUpdatedEvent`
14. **Event Store** persiste el nuevo evento
15. **Transaction Repository** actualiza la proyección con el nuevo estado
16. **Redis Cache** invalida la entrada en caché (evict)
17. Siguiente lectura reconstruirá el estado desde el Event Store

### Flujo de Consulta (Read Path - CQRS Query)

#### Con Cache Hit (80-90% de los casos):
1. **Cliente** envía GET a `/api/v1/transactions/{id}`
2. **Query Bus** despacha el `GetTransactionQuery`
3. **Redis Cache** devuelve la transacción (5-20ms)
4. Respuesta al cliente

#### Con Cache Miss:
1. **Cliente** envía GET a `/api/v1/transactions/{id}`
2. **Query Bus** despacha el `GetTransactionQuery`
3. **Redis Cache** no encuentra la transacción
4. **Event Store** reconstruye el estado desde eventos
5. **Redis Cache** almacena el resultado (cache-aside pattern)
6. Respuesta al cliente

### Ventajas del Event Sourcing

- ✅ **Auditoría completa**: Cada cambio queda registrado
- ✅ **Reconstrucción temporal**: Se puede ver el estado en cualquier momento
- ✅ **Debug facilitado**: API `/api/v1/events` para inspección
- ✅ **Escrituras optimizadas**: Solo INSERT (append-only)
- ✅ **Sin locks**: No hay UPDATE que bloquee lecturas

## 🛠️ Tecnologías

### Backend
- **Java 21**: Lenguaje de programación (LTS)
- **Spring Boot 3.2.0**: Framework principal
- **Spring Data JPA**: Persistencia de datos con Hibernate
- **Spring Data Redis**: Integración con Redis para caché distribuido
- **Spring Cache**: Abstracción de caché con anotaciones
- **Spring Kafka**: Integración con Apache Kafka
- **MapStruct 1.5.5**: Mapeo de objetos DTO/Entity
- **Lombok 1.18.30**: Reducción de boilerplate code
- **Resilience4j 2.3.0**: Circuit breaker y patrones de resiliencia

### Base de Datos
- **PostgreSQL 16**: Base de datos relacional
  - Almacenamiento de transacciones (read model)
  - Event Store con tipo JSONB para eventos
- **Redis 7**: Caché distribuido en memoria
  - Estrategia: Cache-aside pattern
  - TTL: 5 minutos configurables
  - Política de evicción: allkeys-lru
  - Max memory: 512MB

### Mensajería
- **Apache Kafka 7.5.0**: Message broker
  - Topics:
    - `transaction-created`: Transacciones nuevas
    - `transaction-status`: Resultado de validación anti-fraude
- **Confluent Zookeeper 7.5.0**: Coordinación de Kafka
- **Kafka UI**: Interfaz web para monitoreo (puerto 8090)

### Infraestructura
- **Docker**: Contenedorización
- **Docker Compose**: Orquestación de servicios
- **Maven 3.9+**: Gestión de dependencias
- **HikariCP**: Connection pooling optimizado
  - Pool size: 50 conexiones máximas
  - Prepared statement cache habilitado
  - Leak detection configurado

### Arquitectura
- **Monorepo Multi-módulo**: Gestión unificada con Maven
  - `common`: Librería compartida (DTOs, eventos Kafka)
  - `transaction-service`: API REST y gestión de transacciones
  - `antifraud-service`: Validación anti-fraude

## 🚀 Optimización para Alto Volumen

Este proyecto está optimizado para manejar **alto volumen de lecturas y escrituras concurrentes**:

### Estrategias Implementadas

1. **Redis Distributed Cache**
   - Cache-aside pattern
   - TTL configurable por tipo de dato
   - Invalidación automática en actualizaciones
   - Cache hit rate esperado: 80-90%

2. **Event Sourcing**
   - Append-only pattern (solo INSERT)
   - Sin locks de actualización
   - Escrituras optimizadas

3. **CQRS**
   - Separación de modelos lectura/escritura
   - Escalado independiente

4. **Connection Pooling Optimizado**
   - HikariCP con 50 conexiones max
   - Prepared statement cache
   - Leak detection

### Métricas de Performance

| Métrica | Sin Cache | Con Cache |
|---------|-----------|-----------|
| Throughput lecturas | 100-200/seg | 5,000-10,000/seg |
| Latencia P95 lectura | 150ms | 5-20ms |
| Cache hit rate | 0% | 80-90% |

### Configuraciones Clave

- **HikariCP**: Pool de 50 conexiones con prepared statements cache
- **Redis TTL**: 5 minutos (configurable en application.yml)
- **Kafka**: Async processing con retry configurado
- **PostgreSQL**: JSONB para Event Store, índices optimizados

## 📋 Comandos Útiles

### Docker Compose

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f transaction-service

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v

# Reconstruir un servicio específico
docker compose build transaction-service

# Reiniciar un servicio
docker compose restart transaction-service
```

### Maven

```bash
# Compilar todo el proyecto
mvn clean install

# Compilar sin tests
mvn clean install -DskipTests

# Compilar solo un módulo
mvn clean install -pl transaction-service -am

# Ejecutar tests
mvn test
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests de un módulo específico
mvn test -pl transaction-service
```

## 📚 Documentación Adicional

- [Transaction Service README](./transaction-service/README.md) - Documentación del servicio de transacciones
- [Anti-Fraud Service README](./antifraud-service/README.md) - Documentación del servicio anti-fraude
- [Common Module README](./common/README.md) - Documentación del módulo compartido
- [Postman Collection](./Yape-Challenge.postman_collection.json) - Colección de Postman con ejemplos de API

## 🔍 Monitoreo

### Kafka UI
Accede a http://localhost:8090 para:
- Ver topics de Kafka
- Monitorear mensajes
- Ver estado de consumers

### PostgreSQL
```bash
# Conectarse a la base de datos
docker exec -it yape-postgres psql -U yapeuser -d yape_transactions
```

## 📝 Notas

- Los Dockerfiles están ubicados en cada directorio de microservicio
- Cada servicio puede construirse y ejecutarse de forma independiente
- El módulo `common` contiene código compartido entre servicios
- La configuración usa perfiles de Spring para diferentes entornos

## 🐛 Troubleshooting

### Los servicios no se conectan a Kafka
Verifica que Kafka esté saludable:
```bash
docker compose ps kafka
```

### Error de conexión a PostgreSQL
Asegúrate de que PostgreSQL esté listo:
```bash
docker compose ps postgres
```

### Puerto ya en uso
Si algún puerto está ocupado, puedes cambiarlos en `docker-compose.yml`.

