# Reto Java – Transacciones + Anti-Fraude (Kafka)

Implementación del reto usando **Java 21**, **Spring Boot**, **Kafka** y **PostgreSQL** en una arquitectura **event-driven**.

---

##  Resumen del problema

Cada vez que se crea una transacción:

1. Se registra con estado `pending`
2. Se publica un evento en Kafka
3. El microservicio anti-fraude consume el evento, aplica la regla y publica el resultado
4. El microservicio de transacciones consume la respuesta y actualiza el estado en la BD

### Estados
- `pending`
- `approved`
- `rejected`

### Regla anti-fraude
- Si `value > 1000` → **`rejected`**
- Si no → **`approved`**

> Nota: el cambio de estado es asíncrono (event-driven). Puede que necesites reintentar el `GET` luego de unos segundos.

---

##  Arquitectura

Se implementa usando la arquitectura hexagonal y se crea dos microservicios y un módulo compartido:

### 1) `transaction-service`
- **API REST**
    - `POST /transactions`: crea una transacción con estado `pending` y publica un evento en Kafka.
    - `GET /transactions/{transactionExternalId}`: consulta una transacción.
- **Kafka Consumer**
    - Escucha eventos de actualización para persistir el nuevo estado en la BD.

### 2) `anti-fraud-service`
- **Kafka Consumer**
    - Escucha eventos de transacciones creadas.
- Aplica la regla anti-fraude.
- **Kafka Producer**
    - Publica eventos con el estado resultante.

### 3) `common`
- Comparte clases/DTOs de eventos para garantizar consistencia de serialización/deserialización JSON.

---

##  Tópicos Kafka

- `transactions.created`
- `transactions.status-updated`

---

##  Stack

- Java 21
- Spring Boot 3.x
- Maven (multi-módulo)
- PostgreSQL
- Kafka + Zookeeper (Docker Compose)

---

##  Estructura del repositorio

```text
.
├── pom.xml
├── docker-compose.yml
├── common/
├── transaction-service/
└── anti-fraud-service/
```

---

##  Cómo ejecutar en local

###  Requisitos
- Java 21
- Maven 3.9+
- Docker + Docker Compose

### 1) Levantar infraestructura (Kafka + Postgres)
```bash
docker compose up -d
```

### 2) Compilar todos los módulos
```bash
mvn clean package
```

### 3) Ejecutar `transaction-service`
```bash
mvn -U -f .\common\pom.xml clean install
mvn -U -f .\transaction-service\pom.xml spring-boot:run

```

### 4) Ejecutar `anti-fraud-service` (en otra terminal)
```bash
mvn -U -f .\anti-fraud-service\pom.xml spring-boot:run

```

###  Servicios
- `transaction-service`: http://localhost:8080
- `anti-fraud-service`: http://localhost:8081

---

### Crear transacción

**Endpoint**
```http
POST /transactions
```

**Request**
```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

**Response**
```json
{
  "transactionExternalId": "Guid",
  "transactionType": { "name": "TYPE_1" },
  "transactionStatus": { "name": "pending" },
  "value": 120,
  "createdAt": "2026-02-18T12:00:00Z"
}
```

**Ejemplo (curl)**
```bash
curl -X POST "http://localhost:8080/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit":"11111111-1111-1111-1111-111111111111",
    "accountExternalIdCredit":"22222222-2222-2222-2222-222222222222",
    "tranferTypeId":1,
    "value":120
  }'
```

---

### Consultar transacción

**Endpoint**
```http
GET /transactions/{transactionExternalId}
```

**Response**
```json
{
  "transactionExternalId": "Guid",
  "transactionType": { "name": "TYPE_1" },
  "transactionStatus": { "name": "approved" },
  "value": 120,
  "createdAt": "2026-02-18T12:00:00Z"
}
```

**Ejemplo (curl)**
```bash
curl "http://localhost:8080/transactions/<transactionExternalId>"
```

> Nota: el cambio de estado es asíncrono. Puede que necesites reintentar el `GET` después de unos segundos.

---

##  Validación rápida de la regla anti-fraude

### Caso aprobado (`value <= 1000`)
```bash
curl -X POST "http://localhost:8080/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit":"11111111-1111-1111-1111-111111111111",
    "accountExternalIdCredit":"22222222-2222-2222-2222-222222222222",
    "tranferTypeId":1,
    "value":120
  }'
```

### Caso rechazado (`value > 1000`)
```bash
curl -X POST "http://localhost:8080/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit":"11111111-1111-1111-1111-111111111111",
    "accountExternalIdCredit":"22222222-2222-2222-2222-222222222222",
    "tranferTypeId":1,
    "value":1200
  }'
```

Luego consulta el estado:
```bash
curl "http://localhost:8080/transactions/<transactionExternalId>"
```
