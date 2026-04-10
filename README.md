# Payment Settlement Challenge 1

Proyecto de referencia para el **Challenge 1: payment settlement pipeline**. Implementa un pipeline de pagos con **Transactional Outbox**, **Kafka**, **consumidores idempotentes**, **agregación de estado** y **endpoint de consulta con consistencia eventual honesta**, que son justamente las capacidades pedidas por el reto. fileciteturn0file0

---

## 1. Objetivo del proyecto

Cuando un cliente crea un pago, el sistema debe:

1. Persistir el pago en PostgreSQL.
2. Persistir en la misma transacción un evento en la tabla `outbox_events`.
3. Publicar ese evento a Kafka desde un proceso relay separado del flujo HTTP.
4. Ejecutar en paralelo dos consumidores idempotentes:
   - fraude,
   - ledger.
5. Consolidar el estado final del pago como:
   - `pending`,
   - `settled`,
   - `failed`.
6. Notificar el resultado final.

El documento del reto remarca que **no se debe publicar a Kafka dentro de la transacción de base de datos**, y que la solución correcta debe usar un **outbox transaccional** y consumidores **idempotentes**. fileciteturn0file0

---

## 2. Stack tecnológico elegido y por qué

### NestJS
Se eligió NestJS porque:
- ofrece estructura modular clara,
- facilita separar bounded contexts por módulo,
- integra bien con TypeORM, validación y DI,
- es ideal para mostrar código mantenible y entendible en una entrevista técnica.

### PostgreSQL
Se eligió PostgreSQL porque:
- soporta transacciones locales robustas,
- es excelente para implementar el patrón Transactional Outbox,
- permite índices y consultas eficientes sobre la tabla outbox,
- es simple de levantar localmente con Docker.

### Kafka
Se eligió Kafka porque:
- es el broker propuesto implícitamente por el reto,
- desacopla el API de los consumidores,
- permite fan-out del evento `payment.created.v1` a múltiples procesos,
- obliga a diseñar con redelivery e idempotencia, justo lo que se busca evaluar. fileciteturn0file0

### TypeORM
Se eligió TypeORM porque:
- acelera la implementación en NestJS,
- permite transacciones sencillas,
- reduce el tiempo de wiring para enfocarse en arquitectura y no solo en plumbing.

### Docker Compose
Se eligió Docker Compose porque:
- permite levantar PostgreSQL + Kafka + Zookeeper rápidamente,
- deja un entorno repetible para revisión técnica,
- reduce fricción para quien revise el challenge.

---

## 3. Arquitectura técnica

### Componentes principales

- **Payment API**
  - recibe `POST /payments`
  - valida input
  - guarda `payments` + `outbox_events` en una sola transacción
  - expone `GET /payments/:id`

- **Outbox Relay**
  - hace polling de `outbox_events`
  - publica eventos pendientes a Kafka
  - marca eventos como `PUBLISHED`
  - reintenta si falla

- **Fraud Consumer**
  - consume `payment.created.v1`
  - aplica una regla simple de fraude
  - emite `payment.fraud-reviewed.v1` o `payment.failed.v1`

- **Ledger Consumer**
  - consume `payment.created.v1`
  - escribe en `ledger_entries`
  - emite `payment.ledger-written.v1`

- **Status Aggregator**
  - consume `payment.fraud-reviewed.v1`, `payment.ledger-written.v1` y `payment.failed.v1`
  - consolida el estado final del pago
  - emite `payment.settled.v1` cuando ambos pasos obligatorios se completan

- **Notify Consumer**
  - consume `payment.settled.v1` y `payment.failed.v1`
  - persiste un registro de notificación en la tabla `notifications`

---

## 4. Flujo de negocio paso a paso

### Paso 1. Crear pago

El cliente llama:

```http
POST /payments
```

Body ejemplo:

```json
{
  "userId": "usr_001",
  "country": "PE",
  "amount": 100.50,
  "currency": "PEN"
}
```

El servicio `PaymentService`:
- inserta en `payments`,
- inserta en `payment_processing_status`,
- inserta un evento en `outbox_events`,
- todo en **una sola transacción local**.

La respuesta es:

```json
{
  "paymentId": "...",
  "status": "pending",
  "updatedAt": "..."
}
```

Esto es importante porque el reto pide que el endpoint de estado sea **honesto con la consistencia eventual**. fileciteturn0file0

### Paso 2. Relay publica el outbox a Kafka

El `OutboxRelayService` hace polling cada pocos segundos:
- busca eventos `PENDING` o `FAILED` listos para reintento,
- publica a Kafka,
- actualiza el outbox a `PUBLISHED`.

### Paso 3. Consumidores paralelos

Kafka entrega `payment.created.v1` a dos consumidores diferentes:
- fraude,
- ledger.

Ambos son idempotentes y verifican si el `eventId` ya fue procesado.

### Paso 4. Agregación del estado

`StatusAggregatorService` escucha:
- `payment.fraud-reviewed.v1`
- `payment.ledger-written.v1`
- `payment.failed.v1`

Reglas:
- si fraude y ledger terminan bien → `settled`
- si cualquiera falla definitivamente → `failed`
- mientras tanto → `pending`

### Paso 5. Notificación

Cuando el pago termina en `settled` o `failed`, se registra una notificación.

---

## 5. Decisiones técnicas importantes y defensa frente al reto

### 5.1 Por qué Transactional Outbox

Porque el reto explícitamente espera que el pago y el evento se escriban en la misma transacción local, y luego un relay separado los publique al broker. fileciteturn0file0

Esto evita el antipatrón de:
- escribir en DB,
- publicar a Kafka,
- y que uno falle mientras el otro no.

#### Lo que **no** hacemos

```ts
await transaction(async () => {
  await savePayment();
  await kafka.publish(...); // MAL
});
```

#### Lo que sí hacemos

```ts
await transaction(async () => {
  await savePayment();
  await saveOutboxEvent();
});
```

Y luego el relay publica desde la tabla outbox.

### 5.2 Por qué el relay es un proceso separado conceptualmente

El reto pide explícitamente un relay separado del request path, no un publish directo dentro del mismo flujo transaccional. fileciteturn0file0

En esta versión de referencia el relay corre dentro de la misma aplicación NestJS para simplificar el demo local, pero **conceptualmente es un proceso aparte** y puede separarse fácilmente en otra app NestJS o worker.

### 5.3 Por qué los consumidores son idempotentes

Kafka puede redeliverar mensajes. El reto espera que el candidato acepte esa realidad y la resuelva del lado consumidor. fileciteturn0file0

Por eso cada consumidor revisa la tabla `consumer_processed_events` usando:
- `consumer_name`
- `event_id`

Si ya existe el registro, el mensaje se ignora.

### 5.4 Por qué el endpoint devuelve `pending`

Porque el pago todavía no está listo cuando termina el request HTTP. Falta fraude, ledger y agregación. El sistema es eventualmente consistente. El reto valora que esto se explique con honestidad. fileciteturn0file0

---

## 6. Respuesta técnica a lo que pide el challenge 1

### Requisito 1: Transactional Outbox
**Cumplido.**
- Tabla `outbox_events`.
- Inserción del pago y el evento en la misma transacción.
- Publicación real desde `OutboxRelayService`.

### Requisito 2: al menos dos consumidores idempotentes
**Cumplido.**
- `FraudConsumerService`
- `LedgerConsumerService`
- ambos verifican `consumer_processed_events`.

### Requisito 3: DLT / manejo de errores
**Parcialmente cubierto en esta referencia.**
- Ya hay reintentos en el relay.
- La estructura permite agregar un DLT topic como siguiente mejora.
- En el README se documenta cómo extenderlo.

### Requisito 4: endpoint de estado
**Cumplido.**
- `GET /payments/:id`
- devuelve `pending`, `settled` o `failed`.
- incluye subestados (`fraudStatus`, `ledgerStatus`) para trazabilidad.

### Requisito 5: honestidad sobre eventual consistency
**Cumplido.**
- `POST /payments` responde `pending`.
- `GET /payments/:id` muestra estado parcial o final.

---

## 7. Modelo de datos

### `payments`
Estado de negocio visible al cliente.

### `outbox_events`
Buffer transaccional para asegurar atomicidad entre persistencia y publicación.

### `payment_processing_status`
Proyección del progreso del pago:
- fraude,
- ledger,
- final.

### `consumer_processed_events`
Tabla de idempotencia.

### `ledger_entries`
Representa el asiento contable realizado por el consumidor ledger.

### `notifications`
Registra el resultado final comunicado al usuario.

---

## 8. Estructura del proyecto

```text
payment-settlement-challenge/
├─ docker-compose.yml
├─ .env.example
├─ package.json
├─ sql/
│  └─ init.sql
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ common/
│  │  ├─ constants/
│  │  │  ├─ consumer-names.ts
│  │  │  └─ topics.ts
│  │  ├─ contracts/
│  │  │  └─ events.ts
│  │  └─ kafka/
│  │     ├─ kafka.module.ts
│  │     └─ kafka.service.ts
│  ├─ payments/
│  │  ├─ dto/
│  │  ├─ entities/
│  │  ├─ payments.controller.ts
│  │  ├─ payments.module.ts
│  │  └─ payments.service.ts
│  ├─ relay/
│  │  ├─ relay.module.ts
│  │  └─ outbox-relay.service.ts
│  ├─ consumers/
│  │  ├─ consumers.module.ts
│  │  ├─ idempotency.service.ts
│  │  ├─ fraud-consumer.service.ts
│  │  └─ ledger-consumer.service.ts
│  ├─ aggregator/
│  │  ├─ aggregator.module.ts
│  │  └─ status-aggregator.service.ts
│  ├─ notifications/
│  │  ├─ notifications.module.ts
│  │  └─ notify-consumer.service.ts
│  └─ health/
│     ├─ health.controller.ts
│     └─ health.module.ts
```

---

## 9. Cómo levantar el proyecto desde cero

### 9.1 Requisitos
- Node.js 20+
- npm 10+
- Docker Desktop
- Git opcional

### 9.2 Instalar dependencias

```bash
npm install
```

### 9.3 Crear variables de entorno

#### Windows PowerShell
```powershell
Copy-Item .env .env
```

#### CMD
```cmd
copy .env .env
```

### 9.4 Levantar PostgreSQL y Kafka

```bash
docker compose up -d
```

### 9.5 Verificar contenedores

```bash
docker ps
```

Debes ver al menos:
- `payments-postgres`
- `payments-zookeeper`
- `payments-kafka`

### 9.6 Levantar la aplicación

```bash
npm run start:dev
```

### 9.7 Verificar healthcheck

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

---

## 10. Script SQL de PostgreSQL

El archivo está en:

```text
sql/init.sql
```

Ese script se monta automáticamente en el contenedor PostgreSQL y crea las tablas al iniciar por primera vez el volumen.

### Importante
Si ya levantaste PostgreSQL antes sin el script, y quieres que lo ejecute de nuevo automáticamente, debes borrar el volumen:

```bash
docker compose down -v
docker compose up -d
```

Si no quieres borrar el volumen, puedes conectarte manualmente y ejecutar `sql/init.sql`.

### Conectarte a PostgreSQL dentro del contenedor

```bash
docker exec -it payments-postgres psql -U postgres -d payments_db
```

### Consultas útiles

```sql
SELECT * FROM payments;
SELECT * FROM outbox_events ORDER BY created_at DESC;
SELECT * FROM payment_processing_status;
SELECT * FROM consumer_processed_events;
SELECT * FROM ledger_entries;
SELECT * FROM notifications;
```

---

## 11. Pruebas manuales del flujo

### Crear un pago exitoso

```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_001",
    "country": "PE",
    "amount": 100.50,
    "currency": "PEN"
  }'
```

Después consulta:

```bash
curl http://localhost:3000/payments/<paymentId>
```

Resultado esperado después de unos segundos:
- `status = settled`
- `fraudStatus = succeeded`
- `ledgerStatus = succeeded`

### Crear un pago fallido por fraude

```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_002",
    "country": "PE",
    "amount": 7000,
    "currency": "PEN"
  }'
```

Resultado esperado:
- `status = failed`
- `failureReason = Amount exceeds fraud threshold`

---

## 12. Explicación técnica del código para que sea entendible

### `PaymentService`
Escribe el pago y el outbox **en la misma transacción**. Esa es la parte más importante del challenge.

### `OutboxRelayService`
Hace polling del outbox y publica a Kafka. Si falla, deja listo el siguiente retry con backoff simple.

### `FraudConsumerService`
Lee `payment.created.v1`, aplica una regla de fraude simple y emite el evento correspondiente.

### `LedgerConsumerService`
Lee `payment.created.v1`, persiste `ledger_entries` y emite `payment.ledger-written.v1`.

### `StatusAggregatorService`
Actualiza la tabla de proyección `payment_processing_status` y decide si ya se puede cerrar el pago como `settled`.

### `NotifyConsumerService`
No cambia lógica de negocio; solo registra una notificación final. Se mantiene separado para respetar responsabilidades.

---

## 13. Trade-offs y limitaciones declaradas

### 13.1 Relay dentro de la misma app
Para demo local corre en la misma app, pero en producción lo separaría en un worker independiente.

### 13.2 DLT no implementado completamente
El reto lo menciona como requisito deseable. Aquí dejamos reintentos en relay y base lista para ampliar a `{topic}.dlt`.

### 13.3 Regla de fraude simplificada
Se usa una regla por monto para tener una demo reproducible. En un caso real el fraude sería otro servicio o motor de reglas.

### 13.4 Sin observabilidad avanzada
No incluí OpenTelemetry ni Prometheus para mantener foco en la arquitectura principal.

---

## 14. Mejoras que haría con más tiempo

- separar `payment-api` y `outbox-relay` en apps distintas,
- agregar DLT real por topic,
- agregar métricas y tracing,
- agregar tests unitarios e integración,
- usar Debezium/CDC en lugar de polling del outbox,
- endurecer la idempotencia con transacciones locales adicionales en consumidores.

---

## 15. Cómo defender esta solución en el PR o entrevista

### Qué problema resuelve el Outbox
Evita inconsistencias entre base de datos y broker.

### Qué problema resuelve la idempotencia
Tolera redelivery y retries sin duplicar efectos observables.

### Qué problema resuelve la proyección de estado
Permite responder `GET /payments/:id` de forma rápida y honesta.

### Qué trade-off acepté
Preferí simplicidad operativa con polling relay y reglas de ejemplo, a cambio de una implementación clara y defendible del patrón principal.

---

## 16. Endpoints

### POST `/payments`
Crea el pago y responde inmediatamente con estado `pending`.

### GET `/payments/:id`
Consulta el estado actual del pago.

### GET `/health`
Healthcheck básico.

---

## 17. Resumen final

Este proyecto responde al Challenge 1 porque muestra exactamente lo que el documento está evaluando:
- arquitectura distribuida simple pero correcta,
- uso de Transactional Outbox,
- consumidores idempotentes,
- consistencia eventual explicada con honestidad,
- modularidad y claridad técnica. fileciteturn0file0




