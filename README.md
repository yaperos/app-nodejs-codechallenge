# app-nodejs-codechallenge

Este repositorio es un microservicio en NestJS para manejar transacciones financieras. Usa PostgreSQL para persistencia y Kafka para la validación asíncrona (anti-fraud).

Este README describe cómo levantar el entorno, cómo usar los servicios (endpoints) y cómo comprobar el flujo de mensajes con Kafka.

## Resumen técnico
- Framework: NestJS
- Persistencia: PostgreSQL (TypeORM)
- Mensajería: Kafka
- Arquitectura: monolito modular con flujo event-driven para validación anti-fraud

## Requisitos
- Docker & Docker Compose
- Node 18+ y npm o yarn

## Configuración (.env)
Crear un archivo `.env` en la raíz con las variables de Postgres:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
```

Nota: la app por defecto usa `localhost:9092` como broker Kafka. Si ejecutas la app dentro de Docker, usa `kafka:29092` como broker.

## Levantar el entorno

1. Instala dependencias:

```bash
npm install
# o
yarn install
```

2. Levanta infra con Docker Compose (Postgres, Zookeeper, Kafka):

```bash
docker compose up -d
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
npm run local
# o
yarn local
```

### Levantar los dos servicios (transaction + anti-fraud)

Abre dos terminales separados y en cada uno ejecuta:

Terminal A (transaction):

```bash
cd transaction
npm install
npm run local
```

Terminal B (anti-fraud):

```bash
cd anti-fraud
npm install
npm run local
```

Ambos servicios deben poder conectar al broker Kafka que levantaste con `docker compose up -d`.

## Cómo usar los servicios (endpoints)

Base URL: `http://localhost:3000`

1) Crear transacción — POST `/transaction`

- Descripción: crea una transacción y publica el evento para validación anti-fraud.
- Body (JSON):

```json
{
	"accountExternalIdDebit": "5429d629-c239-45fa-8235-1a386258c536",
	"accountExternalIdCredit": "d6cd54da-8ce3-4f79-abda-bd5be9b19e68",
	"tranferTypeId": 1,
	"value": 120
}
```

Ejemplos `curl`:

```bash
curl -i -X POST http://localhost:3000/transaction \
	-H "Content-Type: application/json" \
	-d '{
		"accountExternalIdDebit": "5429d629-c239-45fa-8235-1a386258c536",
		"accountExternalIdCredit": "d6cd54da-8ce3-4f79-abda-bd5be9b19e68",
		"tranferTypeId": 1,
		"value": 120
	}'
```

2) Listar transacciones — GET `/transaction`

- Descripción: devuelve todas las transacciones guardadas (útil para debug local).

```bash
curl http://localhost:3000/transaction
```

## Flujo Kafka (anti-fraud)

- Al crear una transacción se publica un evento `transaction.created` con los datos básicos.
- Un consumidor (anti-fraud) valida la transacción y emite `transaction.validated` con `{ id, status }`.
- La app escucha `transaction.validated` y actualiza el `status` en la base de datos.

Regla implementada en el anti-fraud (ejemplo): `if value > 1000 => rejected`; else `approved`.

3. Consultar la última transacción:

```sql
select * from transaction where "accountExternalIdDebit" = {{ID}};
```

## DDL (esquema) para probar localmente

```sql

CREATE TABLE public.transaction
(
	"accountExternalIdDebit"  varchar                              NOT NULL,
	"accountExternalIdCredit" varchar                              NOT NULL,
	"tranferTypeId"           integer                              NOT NULL,
	value                     numeric                              NOT NULL,
	id                        uuid      DEFAULT uuid_generate_v4() NOT NULL
		CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9"
			PRIMARY KEY,
	"createdAt"               timestamp DEFAULT now()              NOT NULL,
	"updatedAt"               timestamp DEFAULT now()              NOT NULL,
	status                    integer                              NOT NULL
);
```

Si usas TypeORM, la entidad del proyecto crea automáticamente la tabla al iniciar (si `synchronize: true`). Usa este DDL solo si quieres preparar la tabla manualmente o probar fuera del ciclo de arranque de la app.