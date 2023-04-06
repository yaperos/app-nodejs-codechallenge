

## Installation

```bash
$ npm install -g @nestjs/cli
$ npm install
```

## Running the app

```bash
$ npm run start:dev
```

## Env variables

```bash
NODE_ENV = development
PORT = 3002
CONNECTION_STRING = mongodb+srv://hpalacios:gI4WDVOHn4JLH0oa@development.6jvqw.mongodb.net/yape-test?retryWrites=true&w=majority
KAFKA_CLIENT_ID = yape-kafka
KAFKA_HOST = localhost:9092
```

## CURL EXAMPLE REQUESTS

#### POST REQUEST
#### http://localhost:3002/api/transactions
```bash
curl --location 'localhost:3002/api/transactions' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "df5c7959-ab0e-4c7b-accb-04ff1a933490",
    "accountExternalIdCredit": "0ddd7e20-514d-458c-a5ba-e31c1519fc5d",
    "transferTypeId": 0,
    "value": 100
}'
```

#### GET REQUEST
#### http://localhost:3002/api/transactions
```bash
curl --location 'localhost:3002/api/transactions' \
--data ''
```

## DOCUMENTATION
```bash
npx @compodoc/compodoc -p tsconfig.json -s

(Navigate localhost:8080)
```

## API DOCUMENTATION (SWAGGER)
```bash
http://localhost:3002/api/docs#/
```

Datos adicionales:
```
Externamente se está trabajando con MongoDB atlas, en un cluster personal, se pudo insalar en docker compose, pero en éste ejemplo en especifico, se está usando MongoDB atlas para usar el replica set y usar transaccines atómicas.
```

### Ejemplo
```ts
 async create(createDto: CreateTransactionDto) {
        console.log('Step 1::: Transaction creation attempt');
        const session = await this.transactionModel.startSession()
        session.startTransaction();

        try {
            const transaction = new this.transactionModel(createDto);
            await transaction.save({ session })
            await session.commitTransaction();

            const parsedTransaction = plainToClass(TransactionDto, transaction.toJSON());
            // Envio de data para el consumer de anti fraude
            this.producer.send(EVENTS.ON_TRANSACTION_CREATED, JSON.stringify(parsedTransaction));
            return parsedTransaction;

        } catch (ex: any) {
            await session.abortTransaction();
            throw new HttpException(ex, HttpStatus.UNPROCESSABLE_ENTITY, { cause: new Error('Transaction aborted') });
        } finally {

            session.endSession()
        }
    }
```

```bash
El sistema tiene logs para monitorear los procesos, y se hizo la conexion a kafka interna (inicialmente se pensó en un microservicio), el sistema de "anti-fraude", simplemente retorna un valor random, un estado random, puede ser complete|failed, y se ejecuta la transaccion.
```
## Datos adicionales
```bash
El sistema ideal debe conectarse con un microservicio, Kafka, Redis pubsub, Rabbit, de forma isolada, el ejemplo se enfoca en un mismo modulo escuchando los eventos de Kafka.
```