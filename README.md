# Yape Code Challenge — Microservicio de Transacciones

Microservicio listo para evaluación técnica. Expone recursos para **crear** y **consultar** transacciones, persiste con **PostgreSQL/Prisma**, y usa **Kafka** (Redpanda) para orquestar un flujo antifraude (mock) que aprueba/rechaza transacciones de manera asíncrona.

---

## Arquitectura (resumen)

- **API**: Node.js + Express  
- **Persistencia**: PostgreSQL + Prisma ORM  
- **Mensajería**: Kafka (Redpanda) con `kafkajs`  
- **Servicios internos**:
  - **Worker**: consume `transaction.status` y actualiza la transacción
  - **Mock Antifraude**: consume `transaction.created` y publica estado (`approved`/`rejected`)
- **Contenedores**: Docker Compose (app + postgres + redpanda)

---

## Stack

- Node.js 20 (base **Debian/bookworm**, estable para Prisma)  
- Express 4  
- Prisma 5 / @prisma/client  
- KafkaJS 2 (topics: `transaction.created`, `transaction.status`)  
- PostgreSQL 15  
- Redpanda latest

---

## Requisitos

- Docker Desktop (Windows/macOS) o Docker + Docker Compose (Linux)

> Nota Windows: este proyecto está configurado para evitar problemas de OpenSSL en Alpine. La imagen base es **node:20-bookworm**.

---

## Variables de entorno

Crea un archivo `.env` en la raíz:

```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres?schema=public
KAFKA_BROKER=redpanda:9092
KAFKA_CLIENT_ID=transactions-service
KAFKAJS_NO_PARTITIONER_WARNING=1
PORT=3000
```

> El `docker-compose.yml` puede sobreescribirlas; mantenlas coherentes.

---

## Levantar el proyecto

```bash
docker compose down --volumes --remove-orphans
docker compose build --no-cache --pull
docker compose up -d --force-recreate
docker compose up -d app
```

Aplicar migraciones (si no se aplicaron en el arranque):

```bash
docker compose exec app npx prisma migrate deploy
```

Salud:

```bash
curl -s http://localhost:3000/health
# → { "status": "ok" }
```

Logs de la app:

```bash
docker compose logs -f app
```

---

## Endpoints

### 1) Crear transacción

**POST** `/transactions`  
**Body (JSON)**

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

> Se acepta también `transferTypeId` (sin el typo), pero el contrato del reto usa `tranferTypeId`.

**201 Respuesta (ejemplo)**

```json
{
  "transactionExternalId": "b0a1e1a9-3f1e-4d93-9c43-7d5f3b2f1d10",
  "transactionType": { "name": "TRANSFER" },
  "transactionStatus": { "name": "pending" },
  "value": 120,
  "createdAt": "2025-08-11T06:10:00.000Z"
}
```

> El estado pasará a `approved` si `value <= 1000` o `rejected` si `value > 1000` cuando el mock antifraude procese el evento.

---

### 2) Consultar transacción por `transactionExternalId`

**GET** `/transactions/:transactionExternalId`

**200 Respuesta (ejemplo)**

```json
{
  "transactionExternalId": "b0a1e1a9-3f1e-4d93-9c43-7d5f3b2f1d10",
  "transactionType": { "name": "TRANSFER" },
  "transactionStatus": { "name": "approved" },
  "value": 120,
  "createdAt": "2025-08-11T06:10:00.000Z"
}
```

**404**  
```json
{ "error": "not_found" }
```

---

## cURL de prueba

Health:
```bash
curl -s http://localhost:3000/health
```

Crear (aprobado):
```bash
curl -X POST http://localhost:3000/transactions   -H "Content-Type: application/json"   -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
    "tranferTypeId": 1,
    "value": 120
  }'
```

Crear (rechazado):
```bash
curl -X POST http://localhost:3000/transactions   -H "Content-Type: application/json"   -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
    "tranferTypeId": 1,
    "value": 1500
  }'
```

Consultar:
```bash
curl http://localhost:3000/transactions/<transactionExternalId>
```

> Si ves `"pending"`, espera 1–2s y vuelve a consultar; el worker actualiza el estado cuando llega el evento del antifraude.

---

## Contratos de datos

### Modelo `Transaction` (Prisma)

- `id` (BigInt, autoincrement)
- `transactionExternalId` (String, unique)
- `accountExternalIdDebit` (String)
- `accountExternalIdCredit` (String)
- `transactionTypeId` (Int) — mapeado a nombres (`1 → TRANSFER`, etc.)
- `status` (String) — `pending | approved | rejected`
- `value` (Float)
- `currency` (String, por defecto `PEN`)
- `createdAt` (DateTime, default now)

> Nota: Los `BigInt` se serializan como _string_ internamente para evitar errores JSON.

---

## Eventos (Kafka / Redpanda)

- **Topic**: `transaction.created`  
  **Mensaje**:
  ```json
  {
    "transactionExternalId": "uuid",
    "accountExternalIdDebit": "uuid",
    "accountExternalIdCredit": "uuid",
    "tranferTypeId": 1,
    "value": 120
  }
  ```

- **Topic**: `transaction.status` (respuesta antifraude)  
  **Mensaje**:
  ```json
  {
    "transactionExternalId": "uuid",
    "status": "approved" | "rejected"
  }
  ```

---

## Comandos útiles

Logs:
```bash
docker compose logs -f app
```

Entrar a contenedor:
```bash
docker compose exec app sh
```

Estado migraciones Prisma:
```bash
docker compose exec app npx prisma migrate status
```

Prisma Studio:
```bash
docker compose exec app npx prisma studio
```

Redpanda (topics):
```bash
docker compose exec redpanda rpk cluster info
docker compose exec redpanda rpk topic list
```

---

## Troubleshooting

- **`DATABASE_URL` vacío / P1012**: asegúrate de definirlo en `docker-compose.yml > services.app.environment` o en `.env` y reconstruir (`build --no-cache`).
- **`Unexpected token E in JSON` al usar Prisma**: usa imagen base **node:20-bookworm** (Debian), no Alpine.
- **Kafka ECONNREFUSED 127.0.0.1**: dentro de Docker, usa `redpanda:9092` como `KAFKA_BROKER`; además `--advertise-kafka-addr redpanda:9092` en el servicio de Redpanda.
- **Sigue saliendo una validación antigua**: la imagen corre código viejo. Reconstruye sin caché y recrea contenedores:
  ```bash
  docker compose down
  docker compose build --no-cache
  docker compose up -d --force-recreate
  ```

---

## Licencia

Uso exclusivo para evaluación técnica (code challenge).
