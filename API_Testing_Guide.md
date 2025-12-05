# API Testing Guide – Transactions Service

Este documento incluye comandos **curl** para probar las APIs del servicio de transacciones que corre en **[http://localhost:3000](http://localhost:3000)**.

---

## 📌 **1. Crear transacción (S/ 500.50)**

Crea una transacción donde se debita una cuenta y se acredita otra.

```bash
curl --location 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "accountExternalIdCredit": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
  "tranferTypeId": 1,
  "value": 500.50
}'
```

**Descripción:**
Crea una transacción de transferencia por **S/ 500.50**.

---

## 📌 **2. Crear transacción (S/ 1500.00)**

```bash
curl --location 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data '{
  "accountExternalIdDebit": "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "accountExternalIdCredit": "c1d2e3f4-a5b6-c7d8-e9f0-1a2b3c4d5e6f",
  "tranferTypeId": 1,
  "value": 1500.00
}'
```

**Descripción:**
Crea una transacción con un monto mayor por **S/ 1500.00**, útil para validar reglas de negocio o condiciones de fraude.

---

## 📌 **3. Consultar transacción por ID**

```bash
curl --location 'http://localhost:3000/transaction/e6a913fe-026a-4da3-94c3-26af3ec6dc88'
```

**Descripción:**
Obtiene la información de una transacción específica usando su `transactionExternalId`.

---

## ✅ Notas

* Los montos están expresados en **soles (S/)**.
* Cambia el ID de transacción en el endpoint GET para consultar otras transacciones.
* Ideal para pruebas locales antes de integrarlo con los demás microservicios.

---
