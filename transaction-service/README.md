# Transaction Service

Microservicio de gestión de transacciones para Yape Challenge. Implementa **Event Sourcing** y **CQRS** para garantizar auditoría completa y alto rendimiento.

## 🎯 Características

- ✅ **Event Sourcing**: Todos los cambios se guardan como eventos
- ✅ **CQRS**: Separación de comandos y consultas
- ✅ **Redis Cache**: Lecturas optimizadas (5-20ms)
- ✅ **PostgreSQL**: Almacenamiento de transacciones y Event Store
- ✅ **Apache Kafka**: Comunicación asíncrona con Anti-Fraud Service
- ✅ **API REST**: Endpoints para crear y consultar transacciones
- ✅ **Event Store API**: Endpoints para auditoría y debugging

## 🚀 Ejecución

### Con Docker Compose (recomendado)

Desde la raíz del proyecto:
```bash
docker-compose up transaction-service --build
```

### Con Docker

Construir la imagen:
```bash
docker build -t transaction-service:latest -f transaction-service/Dockerfile .
```

Ejecutar el contenedor:
```bash
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/yape_transactions \
  -e SPRING_DATASOURCE_USERNAME=yapeuser \
  -e SPRING_DATASOURCE_PASSWORD=YapePass2026 \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:29092 \
  -e SPRING_REDIS_HOST=redis \
  -e SPRING_REDIS_PORT=6379 \
  transaction-service:latest
```

### Con Maven

Compilar y ejecutar localmente:
```bash
cd transaction-service
mvn clean package -DskipTests
java -jar target/transaction-service-*.jar
```

**Nota**: Asegúrate de tener PostgreSQL, Redis y Kafka ejecutándose localmente.

## 📡 Endpoints

### Puerto
- **8080**

### API de Transacciones

#### Crear Transacción
```bash
POST /api/v1/transactions
Content-Type: application/json

{
  "accountExternalIdDebit": "Guid1",
  "accountExternalIdCredit": "Guid2",
  "tranferTypeId": 1,
  "value": 120.00
}
```

**Respuesta (201 Created):**
```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "transactionStatus": "PENDING",
  "transactionType": 1,
  "value": 120.00,
  "createdAt": "2026-01-04T10:30:00Z"
}
```

#### Obtener Transacción
```bash
GET /api/v1/transactions/{externalId}
```

**Respuesta (200 OK):**
```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "transactionStatus": "APPROVED",
  "transactionType": 1,
  "value": 120.00,
  "createdAt": "2026-01-04T10:30:00Z"
}
```

### API del Event Store (Auditoría)

#### Obtener eventos de una transacción
```bash
GET /api/v1/events/transaction/{transactionId}
```

#### Obtener todos los eventos
```bash
GET /api/v1/events/all
```

#### Obtener eventos por tipo
```bash
GET /api/v1/events/type/{eventType}
```

Tipos disponibles:
- `TransactionCreatedEvent`
- `TransactionStatusUpdatedEvent`

#### Verificar si existe una transacción
```bash
GET /api/v1/events/transaction/{transactionId}/exists
```

#### Contar eventos de una transacción
```bash
GET /api/v1/events/transaction/{transactionId}/count
```

### Actuator (Monitoreo)

- Health: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`
- Circuit Breakers: `http://localhost:8080/actuator/circuitbreakers`

## 🔧 Configuración

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | - | Perfil activo (docker, local) |
| `SPRING_DATASOURCE_URL` | jdbc:postgresql://localhost:5432/yape_transactions | URL de PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | yapeuser | Usuario de PostgreSQL |
| `SPRING_DATASOURCE_PASSWORD` | YapePass2026 | Contraseña de PostgreSQL |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | localhost:9092 | Servidores de Kafka |
| `SPRING_REDIS_HOST` | localhost | Host de Redis |
| `SPRING_REDIS_PORT` | 6379 | Puerto de Redis |
| `SERVER_PORT` | 8080 | Puerto del servicio |

## 🏗️ Arquitectura

### Patrones Implementados

- **Event Sourcing**: Almacenamiento de eventos de dominio
- **CQRS**: Command Bus y Query Bus
- **Domain Events**: Eventos de negocio
- **Cache-Aside**: Patrón de caché con Redis
- **Repository Pattern**: Acceso a datos
- **Aggregate Pattern**: TransactionAggregateService

### Estructura de Paquetes

```
com.yape.challenge.transaction/
├── application/          # CQRS - Commands & Queries
│   ├── bus/             # Command Bus & Query Bus
│   ├── command/         # Commands
│   ├── query/           # Queries
│   ├── handler/         # Handlers
│   └── dto/             # DTOs
├── domain/
│   ├── entity/          # Entities (JPA)
│   ├── event/           # Domain Events
│   └── service/         # Domain Services
├── infrastructure/
│   ├── eventstore/      # Event Store
│   ├── repository/      # Repositories
│   ├── kafka/           # Kafka Producers/Consumers
│   └── config/          # Configuraciones
└── presentation/        # REST Controllers
    ├── controller/
    └── exception/
```

## 📊 Topics de Kafka

- **Produce**: `transaction-created` - Notifica nueva transacción al Anti-Fraud Service
- **Consume**: `transaction-status` - Recibe resultado de validación anti-fraude

## 🗄️ Base de Datos

### Tablas

- `transactions`: Read model (proyección)
- `domain_events`: Event Store (eventos de dominio en JSONB)

### Inicialización

El archivo `db/data.sql` contiene datos iniciales:
- Tipos de transferencia (Transfer Types)

## 🧪 Testing

```bash
# Ejecutar tests
mvn test

# Ejecutar tests con cobertura
mvn test jacoco:report
```

## 🔍 Debugging

### Ver eventos de una transacción

```bash
curl http://localhost:8080/api/v1/events/transaction/{transactionId}
```

### Ver todos los eventos

```bash
curl http://localhost:8080/api/v1/events/all
```

### Ver logs en Docker

```bash
docker-compose logs -f transaction-service
```

## 📈 Performance

- **Throughput lecturas**: 5,000-10,000 req/seg (con cache)
- **Latencia P95**: 5-20ms (con cache hit)
- **Cache hit rate esperado**: 80-90%

## 🔗 Referencias

- [README Principal](../README.md)
- [Anti-Fraud Service](../antifraud-service/README.md)



