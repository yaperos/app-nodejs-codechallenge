# Yape Code Challenge - Quarkus  

Sistema de transacciones financieras con validación anti-fraude usando Kafka y arquitectura hexagonal.

# Tech Stack

- **Quarkus 3.8** - Framework Java
- **PostgreSQL 15** - Base de datos
- **Apache Kafka** - Mensajería de eventos
- **Redis** - Cache e idempotencia
- **Arquitectura Hexagonal** - Clean Architecture

## API Endpoints

### Crear Transacción

```bash
POST http://localhost:8080/transactions
Content-Type: application/json

{
  "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
  "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
  "tranferTypeId": 1,
  "value": 500
}
```

**Respuesta (201 Created):**
```json
{
  "transactionExternalId": "generated-uuid",
  "transactionType": {
    "name": "Transfer"
  },
  "transactionStatus": {
    "name": "pending"
  },
  "value": 500,
  "createdAt": "2024-01-15T10:30:00"
}
```

### Consultar Transacción

```bash
GET http://localhost:8080/transactions/{transactionExternalId}
```

**Respuesta (200 OK):**
```json
{
  "transactionExternalId": "uuid",
  "transactionType": {
    "name": "Transfer"
  },
  "transactionStatus": {
    "name": "approved"
  },
  "value": 500,
  "createdAt": "2024-01-15T10:30:00"
}
```
