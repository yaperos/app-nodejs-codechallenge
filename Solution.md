# Solution
Como arquitectura debemos de tener dos microservicios y un BFF (Backend for Frontend
).
* **bff-yape:** es un patrón de diseño de microservicios que nos permite considerar que el acceso a nuestro servicio se realiza desde clientes específicos con necesidades específicas.
* **ms-transaction:** services of transactions
* **ms-fraud:** services of check transactions

Por el momento he trabajado con los microservicios y la parte de api está dentro del ms-transactions para que puedan ver la parte de interfaces para ver los diferentes medios de comunicación con el sistema.

### Consideraciones
* Patrón Singleton: para la conexiones de base de datos, brocker.
* Patrón Command: cada operación es implementada como una clase independiente que realiza una acción muy concreta 
* Patrón Observer: se le conoce como Publicador- Suscriptor
* ...

#### Estructura

```
|-- project/
    |-- src/
    |   |-- commands/
    |   |-- domain/
    |   |   |-- entities/
    |   |   |-- dtos/
    |   |-- infra/
    |   |   |-- db/
    |   |   |-- broker/
    |   |-- interfaces/
    |   |   |-- listener/
    |   |   |-- crons/
    |   |   |-- rest/
    |   |-- queries/
    |-- tests/
```

- **src/** contiene el código funcional de la aplicación.
- **src/commands/** contiene la implementación de los casos de uso del sistema, si bien la lógica de negocio es responsabilidad de la *capa de dominio*, suele ser necesaria la interacción con data, repositorios, logs, etc. Los métodos implementados aqui cambian el estado del sistema pero no devuelven valores.
- **src/domain/** lógica de negocio, independiente de sistemas de persistencia, servicios web externos, etc.
- **src/domain/entities/** los objetos del dominio que nos interesa mapear. Por ejemplo: *Cliente, Transaccion,* etc. Las entidades presentan comportamiento y reglas relativas únicamente a dicha entidad.
- **src/domain/dtos/** lógica de negocio donde intervienen más de una entidad y mostrar al usuario.
- **src/infra/** capa de conexión a sistemas externos, bases de datos, servicios web, colas, etc.
- **src/infra/db/** patrón para interacción con sistemas de persistencia [Repository Pattern](https://www.codeproject.com/Articles/526874/Repository-Pattern-Done-Right).
- **src/interfaces/** contiene la lógica que permite la comunicación de nuestro sistema con el exterior, ya sean controladores http, comandos de consola, listeners de eventos, etc.
- **src/queries/** es parecido a commands con la diferencia que sus métodos devuelven un resultado y no cambian el estado del sistema.

#### Flujo
En resumen, la capa de *interfaces* recepciona un input del exterior, ya sea un HTTP request, la escucha a un evento, etc. Luego esta se encarga de ejecutar la acción correspondiente de la capa *application*. La capa *application* orquestará las acciones requeridas entre la capa de *infra* y la lógica de negocio de *domain*.

---
### Create tables in DB
```
-- Table: public.transactions

DROP TABLE IF EXISTS public.transactions;

CREATE TABLE IF NOT EXISTS public.transactions
(
    id serial PRIMARY KEY,
    transaction_external_id VARCHAR ( 50 ) UNIQUE NOT NULL,
    account_external_id_debit VARCHAR ( 50 )   NULL,
    account_external_id_credit VARCHAR ( 50 )  NULL,
	tranfer_type_id INT NOT NULL,
    value INT NOT NULL,
    status VARCHAR ( 50 )  NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.transactions
    OWNER to postgres;

-- =================================================================
-- Table: public.frauds

DROP TABLE IF EXISTS public.frauds;

CREATE TABLE IF NOT EXISTS public.frauds
(
    id serial PRIMARY KEY,
    transaction_external_id VARCHAR ( 50 ) UNIQUE  NULL,
    tranfer_type_id INT NOT NULL,
    value INT NOT NULL,
    status VARCHAR ( 50 )  NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.frauds
    OWNER to postgres;

```

---
### Run app

* 1: levantar docket
* 2: Create tables
* 3: levantar microservicios
    ```
    $ cd ms-transaction/
    $ npm start

    $ cd ms-fraud/
    $ npm start
    ```
* 4: Ejecutar curls
---
### create transactions debit
```
curl --location 'http://localhost:5001/ms-transactions/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "67fb613a-d2b2-494c-ad70-644d8d8a094t",
    "tranferTypeId": 1,
    "value": 1900
}'
```
---
### create transactions credit
```
curl --location 'http://localhost:5001/ms-transactions/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdCredit": "67fb613a-d2b2-494c-ad70-644d8d8a094g",
    "tranferTypeId": 2,
    "value": 1900
}'
```
---
### list transactions

```
curl --location 'http://localhost:5001/ms-transactions/transactions'
```
---
### Screenshots

![Transactions list](./resources/list-transaction.png?raw=true)

![Transactions create](./resources/create-transaction.png?raw=true)

![Transactions sql](./resources/transaction-sql.png?raw=true)

![Frauds sql](./resources/fraud-sql.png?raw=true)
