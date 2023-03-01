# YAPE TRANSACTIONS 🤖

Tecnologías utilizadas: 

<ol>
  <li>Nest.js</li>
  <li>GraphQL</li>
  <li>Prisma</li>
  <li>Postgres</li>
  <li>Redis</li>
  <li>Kafka</li>
  <li>Docker</li>
</ol>


Antes de probar:

- [Configuración en local](#Configuración)


# Servicios 🚀

## Crear transacción

Servicio construido con GraphQL y expuesto en el microservicio `ms-transaction`

![create_transaction](/images/create_transaction.PNG)


Después de creada la transacción se enviará un evento al microservicio `ms-anti-fraud` 
para validar el valor ingresado.

![create_transaction](/images/sent_event_create_transaction.PNG)

Estará a la escucha de que llegue el evento en `ms-anti-fraud`

![create_transaction](/images/subs_event_create_transaction.PNG)

Validará según el valor máximo y emitirá un evento al microservicio
`ms-transaction` para actualizar el estatus de la transacción.

![create_transaction](/images/sent_event_update.PNG)

Estará a la escucha de que llegue el evento en `ms-transaction`

![create_transaction](/images/subs_event_update.PNG)

> [!IMPORTANT]
>
> Ante la gran demanda de actualizar concurrentemente el estado de la transacción apliqué
 **EL CONTROL DE CONCURRENCIA OPTIMISTA (OOC)**, usamos un token de concurrencia (una marca de tiempo o un campo de versión) para detectar cambios en un registro.



_ _ _ _


## Recuperar una transacción

Utilizo `Redis` para una respuesta más rápida y en la consulta como tal en Postgres
utilizo consultas sin procesar (Raw database access)


![create_transaction](/images/get_transaction.PNG)


# Configuración 🔧

1. En la raiz del proyecto ejecutar el siguiente comando para levantar los contenedores de Postgres, Redis y Kafka

```bash
docker-compose up
```

2. En el microservicio `ms-transaction`

```bash
cd ms-transaction
```
- Crearemos el archivo .env (dejar estos valores por defecto)

```bash
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_NAME="yapedb"
POSTGRES_USER="username"
POSTGRES_PASSWORD="password"

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}?schema=public"
```

- Luego migraremos la base de datos

```bash
npm run migrate
```

- Poblar la base de datos con registros necesarios y mínimos

```bash
npx prisma db seed
```

- Por último levantar el microservicio `ms-transaction`

```bash
npm run start:dev
```

3. En el microservicio `ms-anti-fraud`

```bash
cd ms-anti-fraud

npm run start:dev
```