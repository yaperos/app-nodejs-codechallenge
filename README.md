# Sistema de Transacciones con Validación Anti-Fraude

##  Descripción

Sistema de transacciones financieras con validación anti-fraude en tiempo real, implementado con arquitectura de microservicios y comunicación asíncrona mediante Apache Kafka.

### Arquitectura

```
Cliente → Transaction Service (REST API)
              ↓ (guarda en PostgreSQL)
              ↓ (publica evento en Kafka)
          Anti-Fraud Service
              ↓ (valida: value > 1000 = reject)
              ↓ (publica resultado en Kafka)
          Transaction Service
              ↓ (actualiza estado en PostgreSQL)
```

### Stack Tecnológico

- **Java 17**
- **Spring Boot 3.2.1**
- **PostgreSQL 14**
- **Apache Kafka**
- **Maven 3.9+**
- **Docker & Docker Compose**

---

##  Inicio Rápido

### Prerrequisitos

```bash
- Java 17 o superior (JDK)
- Maven 3.9+
- Docker Desktop
- Git
```

### 1. Levantar Infraestructura (PostgreSQL + Kafka)

```powershell
# Desde el directorio raíz del proyecto
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps

# Verificar logs
docker-compose logs -f
```

Servicios disponibles:
- PostgreSQL: `localhost:5432`
- Kafka: `localhost:9092`
- Zookeeper: `localhost:2181`

### 2. Compilar el Proyecto

```powershell
# Compilar todos los módulos
mvn clean install
```

### 3. Ejecutar Transaction Service

```powershell
# Opción 1: Desde Maven
cd transaction-service
mvn spring-boot:run

# Opción 2: Desde JAR compilado
cd transaction-service\target
java -jar transaction-service-1.0.0.jar
```

El servicio estará disponible en: `http://localhost:8080`

### 4. Ejecutar Anti-Fraud Service (en otra terminal)

```powershell
# Opción 1: Desde Maven
cd anti-fraud-service
mvn spring-boot:run

# Opción 2: Desde JAR compilado
cd anti-fraud-service\target
java -jar anti-fraud-service-1.0.0.jar
```

El servicio estará disponible en: `http://localhost:8081`

---

##  API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### 1. Crear Transacción

**POST** `/transactions`

**Request Body:**
```json
{
  "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "accountExternalIdCredit": "7ba95f64-8821-4562-b3fc-2c963f66afa9",
  "tranferTypeId": 1,
  "value": 500.50
}
```

**Response (201 Created):**
```json
{
  "transactionExternalId": "9ca85f64-1234-4562-b3fc-2c963f66afa1",
  "transactionType": {
    "name": "transfer"
  },
  "transactionStatus": {
    "name": "pending"
  },
  "value": 500.50,
  "createdAt": "2026-01-03T10:30:00"
}
```

### 2. Obtener Transacción

**GET** `/transactions/{transactionExternalId}`

**Response (200 OK):**
```json
{
  "transactionExternalId": "9ca85f64-1234-4562-b3fc-2c963f66afa1",
  "transactionType": {
    "name": "transfer"
  },
  "transactionStatus": {
    "name": "approved"
  },
  "value": 500.50,
  "createdAt": "2026-01-03T10:30:00"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Transaction not found",
  "message": "Transaction not found with id: 9ca85f64-1234-4562-b3fc-2c963f66afa1",
  "timestamp": "2026-01-03T10:30:00Z"
}
```

---

##  Testing Manual con cURL

### Crear transacción APROBADA (value <= 1000)

```powershell
curl -X POST http://localhost:8080/api/v1/transactions `
  -H "Content-Type: application/json" `
  -d '{
    "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "accountExternalIdCredit": "7ba95f64-8821-4562-b3fc-2c963f66afa9",
    "tranferTypeId": 1,
    "value": 800.50
  }'
```

### Crear transacción RECHAZADA (value > 1000)

```powershell
curl -X POST http://localhost:8080/api/v1/transactions `
  -H "Content-Type: application/json" `
  -d '{
    "accountExternalIdDebit": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "accountExternalIdCredit": "7ba95f64-8821-4562-b3fc-2c963f66afa9",
    "tranferTypeId": 1,
    "value": 1500.00
  }'
```

### Consultar transacción

```powershell
# Reemplazar {UUID} con el transactionExternalId recibido
curl http://localhost:8080/api/v1/transactions/{UUID}
```

---

##  Flujo de Procesamiento

1. **Cliente crea transacción** → POST a Transaction Service
2. **Transaction Service:**
   - Valida datos
   - Guarda transacción con estado `pending` en PostgreSQL
   - Publica evento `transaction-created` en Kafka
   - Retorna respuesta al cliente
3. **Anti-Fraud Service:**
   - Consume evento `transaction-created`
   - Aplica regla: `value > 1000 ? "rejected" : "approved"`
   - Publica evento `transaction-status-updated` en Kafka
4. **Transaction Service:**
   - Consume evento `transaction-status-updated`
   - Actualiza estado de transacción en PostgreSQL
5. **Cliente consulta transacción** → GET a Transaction Service
   - Retorna transacción con estado actualizado

---

##  Arquitectura del Código

### Transaction Service

```
transaction-service/
├── domain/                      # Lógica de negocio pura
│   ├── model/                   # Entidades de dominio
│   ├── port/                    # Interfaces (Hexagonal)
│   └── exception/               # Excepciones de dominio
├── application/                 # Casos de uso
│   ├── dto/                     # DTOs de aplicación
│   └── service/                 # Servicios de aplicación
└── infrastructure/              # Adaptadores
    ├── api/                     # REST Controllers
    ├── persistence/             # JPA + PostgreSQL
    └── messaging/               # Kafka Producer/Consumer
```

### Anti-Fraud Service

```
anti-fraud-service/
├── domain/                      # Lógica de validación
│   └── service/                 # FraudValidatorService
└── infrastructure/              # Adaptadores
    └── messaging/               # Kafka Consumer/Producer
        ├── consumer/
        ├── producer/
        └── config/
```

---

##  Modelo de Datos

### Estados de Transacción
- `pending`: Estado inicial al crear la transacción
- `approved`: Transacción aprobada por anti-fraude (value <= 1000)
- `rejected`: Transacción rechazada por anti-fraude (value > 1000)

### Tipos de Transacción
- `1`: Transfer
- `2`: Deposit
- `3`: Withdrawal

---

##  Health Checks

### Transaction Service
```bash
curl http://localhost:8080/actuator/health
```

### Anti-Fraud Service
```bash
curl http://localhost:8081/actuator/health
```



## Limpieza

```powershell
# Detener servicios
docker-compose down

# Detener servicios y eliminar volúmenes (borra datos)
docker-compose down -v

# Limpiar build de Maven
mvn clean
```

---

##  Características Implementadas

- ✅ Clean Architecture / Hexagonal Pattern
- ✅ Separación de capas (Domain, Application, Infrastructure)
- ✅ Comunicación asíncrona con Kafka
- ✅ Persistencia con PostgreSQL + Flyway migrations
- ✅ Validación de datos con Bean Validation
- ✅ Manejo de errores global
- ✅ Optimistic Locking para concurrencia
- ✅ Health checks con Spring Actuator
- ✅ Logging estructurado
- ✅ Configuración por ambientes
- ✅ Docker Compose para infraestructura

---

##  Autor

**Ricardo** - Reto Técnico Yape Backend Java

---.

