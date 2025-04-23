# Financial Transaction System

## 📋 Descripción del Proyecto
Sistema de procesamiento de transacciones financieras implementado con una arquitectura de microservicios. El sistema maneja la creación y validación de transacciones financieras con un servicio anti-fraude integrado.

```mermaid
graph TD
    A[Cliente] -->|POST /transactions| B[Transaction Service]
    B -->|Evento: TRANSACTION_CREATED| C[Anti-Fraud Service]
    C -->|Evento: TRANSACTION_STATUS_APPROVED/REJECTED| B
    B -->|Guarda Transacción| D[(PostgreSQL)]
```

## 🏗️ Arquitectura

### Microservicios
El proyecto está estructurado en dos microservicios principales:

1. **Transaction Service**
   - Maneja las operaciones CRUD de transacciones
   - Expone API REST
   - Persiste datos en PostgreSQL
   - Emite eventos a Kafka

2. **Anti-Fraud Service**
   - Valida transacciones
   - Consume eventos de Kafka
   - Implementa reglas de negocio (ej: rechazo de transacciones > 1000)

### Estructura del Proyecto
```
app-nodejs-codechallenge/
├── apps/
│   ├── transaction-service/
│   └── anti-fraud-service/
├── libs/
│   └── shared/           # Código compartido entre servicios
├── docs/
│   └── postman_collection.json
└── docker-compose.yml
```

## 🛠️ Stack Tecnológico

- **NestJS**: Framework para construir aplicaciones Node.js escalables
- **Kafka**: Sistema de mensajería para comunicación entre servicios
- **PostgreSQL**: Base de datos relacional para persistencia
- **Prisma**: ORM para TypeScript
- **Docker**: Contenedorización y orquestación
- **ESLint/Prettier**: Linting y formateo de código

## 🚀 Cómo Ejecutar

1. **Clonar el repositorio**
```bash
git clone https://github.com/username/app-nodejs-codechallenge.git
cd app-nodejs-codechallenge
```

2. **Iniciar servicios con Docker**
```bash
docker-compose up -d
```

## 💻 Servicios en Docker Compose

### Servicios Principales

1. **Transaction Service** (Puerto: 3000)
```yaml
transaction-service:
  build:
    context: .
    dockerfile: apps/transaction-service/Dockerfile
  environment:
    - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/transactions
    - KAFKA_BROKERS=kafka:9092
```

2. **Anti-Fraud Service**
```yaml
anti-fraud-service:
  build:
    context: .
    dockerfile: apps/anti-fraud-service/Dockerfile
  environment:
    - KAFKA_BROKERS=kafka:9092
```

### Base de Datos

3. **PostgreSQL** (Puerto: 5432)
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
    - POSTGRES_DB=transactions
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

4. **Migraciones de Base de Datos**
```yaml
postgres-migrations:
  build:
    context: .
    dockerfile: apps/transaction-service/Dockerfile
    target: builder
  command: [
    "sh", "-c",
    "cd apps/transaction-service && \
     npx prisma migrate dev --name init --create-only && \
     npx prisma migrate deploy && \
     npx ts-node prisma/seed.ts"
  ]
```

### Herramientas de Monitoreo

5. **Kafka UI** (Puerto: 8080)
```yaml
kafka-ui:
  image: provectuslabs/kafka-ui:latest
  ports:
    - "8080:8080"
  environment:
    - KAFKA_CLUSTERS_0_NAME=local
    - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092
```

### Orden de Inicio
```mermaid
graph TD
    A[Kafka] --> B[PostgreSQL]
    B --> C[Migraciones]
    C --> D[Transaction Service]
    C --> E[Anti-Fraud Service]
```

### Características

1. **Migraciones Automáticas**
   - Ejecuta migraciones Prisma al inicio
   - Carga datos iniciales con seed
   - Espera a que PostgreSQL esté listo

2. **Kafka UI**
   - Interfaz web para monitoreo de Kafka
   - Visualización de tópicos y mensajes
   - Monitoreo de consumidores
   - Métricas en tiempo real

3. **Volúmenes Persistentes**
   - Datos de PostgreSQL preservados
   - Logs persistentes
   - Configuraciones persistentes

4. **Health Checks**
   - Verificación de servicios dependientes
   - Reinicio automático en fallos
   - Orden de inicio controlado

## 📡 API Endpoints

### Crear Transacción
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "123e4567-e89b-12d3-a456-426614174004",
    "accountExternalIdCredit": "123e4567-e89b-12d3-a456-426614174006",
    "tranferTypeId": 1,
    "value": 1500
  }'
```

### Obtener Transacción
```bash
curl http://localhost:3000/transactions/:id
```

### Obtener Todas las Transacciones
```bash
curl http://localhost:3000/transactions
```

## 📚 Documentación
- Colección de Postman disponible en `/docs/postman_collection.json`
- Swagger UI disponible en `http://localhost:3000/api`

## 🤔 Decisiones de Diseño

### ¿Por qué Microservicios?
1. **Separación de Responsabilidades**: Cada servicio tiene una función específica
2. **Escalabilidad Independiente**: Cada servicio puede escalar según sus necesidades
3. **Aislamiento de Fallos**: Un problema en el servicio anti-fraude no afecta directamente al servicio de transacciones

### ¿Por qué una carpeta libs/shared?
1. **DRY (Don't Repeat Yourself)**: Evita duplicación de código
2. **Consistencia**: Garantiza que ambos servicios usen las mismas definiciones
3. **Mantenibilidad**: Un solo lugar para actualizar código compartido

## 🔄 Flujo de Eventos
```mermaid
sequenceDiagram
    participant Client
    participant TS as Transaction Service
    participant Kafka
    participant AFS as Anti-Fraud Service
    participant DB as PostgreSQL

    Client->>TS: POST /transactions
    TS->>DB: Crear transacción (status: pending)
    TS->>Kafka: TRANSACTION_CREATED
    Kafka->>AFS: Consume evento
    AFS->>Kafka: TRANSACTION_STATUS_APPROVED/REJECTED
    Kafka->>TS: Consume respuesta
    TS->>DB: Actualizar status
    TS->>Client: Transaction Response
```

## 🚀 Mejoras Propuestas

### 1. Implementación de Cache con Redis
- Cachear resultados de consultas frecuentes
- Reducir latencia en operaciones de lectura
- Implementar cache-aside pattern

### 2. Migración a CQRS/Event Sourcing
- Separar operaciones de lectura y escritura
- Mejor escalabilidad y rendimiento
- Historial completo de cambios

### 3. DynamoDB para Escrituras
- Escrituras ultra rápidas
- Escalabilidad automática
- Mejor para cargas de trabajo intensivas

### 4. GraphQL
- Consultas más flexibles
- Reducción de over-fetching
- Mejor experiencia para consumidores de la API

### 5. Observabilidad
- Implementar OpenTelemetry
- Monitoreo con Prometheus
- Visualización con Grafana

### 6. Testing
- Pruebas unitarias con Jest
- Pruebas de integración
- Pruebas de carga con k6

## 📈 Métricas y Monitoreo (Propuesto)
```mermaid
graph LR
    A[Servicios] -->|Métricas| B[Prometheus]
    A -->|Logs| C[ELK Stack]
    A -->|Traces| D[Jaeger]
    B --> E[Grafana]
    C --> E
    D --> E
```

## 🔒 Seguridad (Propuesto)
- Implementar autenticación JWT
- Rate limiting
- Circuit breakers
- Validación de entrada robusta
- Auditoría de transacciones

## 🌐 Escalabilidad
- Servicios stateless para facilitar escalado horizontal
- Kafka para desacoplamiento y resiliencia
- Bases de datos con sharding para mayor rendimiento

## 💡 Patrones de Diseño Implementados

### 1. Event-Driven Architecture
- Comunicación asíncrona vía Kafka
- Desacoplamiento entre servicios
- Mejor resiliencia y escalabilidad

### 2. Repository Pattern (con Prisma)
- Abstracción de la capa de datos
- Facilita cambios en la fuente de datos
- Mejora la testeabilidad

### 3. Dependency Injection
- Inversión de control en NestJS
- Módulos desacoplados
- Facilita el testing unitario

### 4. Base Service Pattern
```typescript
@Injectable()
export abstract class BaseKafkaService implements OnModuleInit {
  constructor(protected readonly kafkaClient: ClientKafka) {}
  // Implementación común para conexión Kafka
}
```

## 🔍 Detalles de Implementación

### Validación Anti-Fraude
```mermaid
flowchart TD
    A[Nueva Transacción] -->|value > 1000| B{Anti-Fraude}
    B -->|Rechazada| C[Actualizar Status]
    B -->|Aprobada| D[Procesar Transacción]
```

### Estructura de Base de Datos
```mermaid
erDiagram
    Transaction ||--o{ TransactionType : has
    Transaction ||--o{ TransactionStatus : has
    Transaction {
        string externalId
        string accountExternalIdDebit
        string accountExternalIdCredit
        decimal value
        datetime createdAt
    }
```

## 📊 Ejemplos de Respuestas API

### Crear Transacción (Exitosa)
```json
{
  "transactionExternalId": "123e4567-e89b-12d3-a456-426614174000",
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "PENDING"
  },
  "value": 1500,
  "createdAt": "2025-04-21T23:02:24-05:00"
}
```

### Error de Validación
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "value must be a positive number",
    "accountExternalIdDebit must be a UUID"
  ]
}
```

## 🔄 Ciclo de Vida de una Transacción
1. **Creación**: Status PENDING
2. **Validación Anti-Fraude**:
   - Si value > 1000: REJECTED
   - Si value ≤ 1000: APPROVED
3. **Actualización** del status final

## 🎯 Objetivos del Diseño
1. **Alta Disponibilidad**
   - Servicios independientes
   - Sin puntos únicos de fallo
   - Recuperación automática

2. **Consistencia Eventual**
   - Garantizada por eventos Kafka
   - Transacciones siempre llegan a estado final
   - Retry automático en fallos

3. **Mantenibilidad**
   - Código modular
   - Patrones consistentes
   - Documentación clara

## 📈 KPIs Sugeridos
- Tiempo promedio de procesamiento de transacción
- Tasa de rechazo por anti-fraude
- Latencia de eventos Kafka
- Disponibilidad del servicio
- Tasa de error en transacciones
