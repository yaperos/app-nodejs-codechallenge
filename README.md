# Yape Code Challenge – Servicios de Transacciones y Anti-Fraude

## Descripción general

Este repositorio implementa un sistema orientado a eventos que modela el ciclo de vida de una transacción financiera, la cual debe ser validada por un servicio de anti-fraude antes de confirmar su estado final.

La solución está compuesta por dos servicios independientes que se comunican de manera asíncrona mediante Kafka:

- **Transaction Service**: expone APIs HTTP para crear y consultar transacciones, gestiona la persistencia y publica eventos.
- **Anti-Fraud Service**: consume eventos de transacciones creadas, aplica reglas de validación y publica el resultado.

El sistema sigue un modelo de **consistencia eventual** y está diseñado considerando confiabilidad, idempotencia y escenarios de alto volumen.

### Principios aplicados

- Comunicación asíncrona mediante eventos
- Arquitectura orientada a eventos
- Consistencia eventual
- Consumers idempotentes
- Publicación confiable de eventos usando Outbox Pattern

---

## Servicios

### 1. Transaction Service

#### Responsabilidades

- Crear transacciones con estado inicial `pending`
- Persistir información de la transacción
- Publicar eventos `TransactionCreated`
- Consumir eventos `TransactionValidated` para actualizar el estado
- Exponer APIs HTTP para consulta

---

### Endpoints

#### Crear transacción

**POST** `/transactions`

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

Respuesta:

```json
{
  "transactionExternalId": "Guid",
  "transactionStatus": {
    "name": "pending"
  }
}
```

---

#### Obtener transacción

**GET** `/transactions/{transactionExternalId}`

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "approved | rejected | pending"
  },
  "value": 120,
  "createdAt": "ISO Date"
}
```

---

## Ejecución local

### Requisitos

- Node.js 18+
- pnpm
- Docker / Docker Compose

---

### Pasos

#### 1. Levantar infraestructura (Kafka + PostgreSQL)

```bash
pnpm dev:infra
```

#### 2. Instalar dependencias

```bash
pnpm install
```

#### 3. Aplicar esquema de base de datos

```bash
pnpm db:push
```

#### 4. Ejecutar servicios

```bash
pnpm dev:transaction
pnpm dev:antifraud
```

---

## Adrian Lopez
