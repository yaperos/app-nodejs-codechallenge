# API Testing Guide

### Cómo probar las APIs del proyecto

Este documento describe paso a paso cómo probar los endpoints del microservicio **ms-transaction**, incluyendo la creación de transacciones, validación por el microservicio anti-fraud y la consulta de transacciones por su ID externo.

Se asume que ambos microservicios están levantados localmente y que Kafka está funcionando según la configuración provista.

---

# 1. Crear una transacción (caso aprobado)

Este endpoint crea una transacción con estado inicial **pending**, la envía a Kafka, y posteriormente el microservicio **ms-anti-fraud** actualizará su estado a **approved** si el valor es menor o igual a 1000.

### **Request:**

```bash
curl --location 'http://localhost:8081/transaction' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "accountExternalIdCredit": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
  "tranferTypeId": 1,
  "value": 500.50
}'
```

### **Respuesta esperada (inmediata):**

```json
{
  "transactionExternalId": "GENERATED-ID",
  "transactionType": { "name": "transfer" },
  "transactionStatus": { "name": "pending" },
  "value": 500.50,
  "createdAt": "2025-12-05T..."
}
```

> El estado cambiará a **approved** después de que ms-anti-fraud procese el mensaje Kafka.

---

# 2. Crear una transacción (caso rechazado)

Si el valor es **mayor a 1000**, el anti-fraud debe actualizar la transacción a **rejected**.

### **Request:**

```bash
curl --location 'http://localhost:8081/transaction' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "accountExternalIdCredit": "c1d2e3f4-a5b6-c7d8-e9f0-1a2b3c4d5e6f",
  "tranferTypeId": 1,
  "value": 1500.00
}'
```

### **Respuesta inicial:**

```json
{
  "transactionExternalId": "GENERATED-ID",
  "transactionType": { "name": "transfer"
```
