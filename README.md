# Solución reto técnico

Para la solución al reto técnico se han desarrollado dos microservicios: <b>transaction-service</b> y <b>antifraud-service</b> con NodeJs v18.12.1, NestJs v9.0.0 y TypeOrm v9.0.1.

## Microservicio transaction-service

### Módulo commands

Este microservicio ejecuta la lógica de negocio de crear una transacción y recuperar la transacción creada, se ha utilizado Graphql y se ha implementado el patró   n CQRS por lo que se ha creado dos módulos: <b>commands</b> y <b>queries</b>, tambien se ha montado una base de datos <b>postgres v14</b> para ejecutar altas y bajas, es decir, comandos CREATE, UPDATE, DELETE y una base de datos <b>mongo</b> para realizar todas las QUERY, adicionalmente se a implementado el microservicio con una arquitectura <b>hexagonal</b> o una arquitectura de <b>puertos</b> y <b>adaptadores</b>.

#### Petición graphql

Para crear una transacción lo podemos hacer haciendo uso de un cliente como postman o el propio playground de graphql, que para entornos de desarrollo puede activarse y para entornos de producción debe estar desactivado. Para acceder al playground debe ir a la siguiente ruta <b>http://localhost:3000/graphql</b>

<p align="center">
    <img src="https://i.postimg.cc/zDS3NznG/mutacion-create-transaction.png"/>
</p>

```javascript
mutation CreateTransaction($transaction: NewTransactionInputType!) {
  createTransaction(transaction: $transaction) {
    transactionExternalId
  }
}
```

<p align="center">
    <img src="https://i.postimg.cc/qMcknjmB/body-mutation-create-transaction.png"/>
</p>


```javascript
{
  "transaction": {
    "accountExternalIdDebit": "a1908148-0370-11ee-be56-0242ac120002",
    "accountExternalIdCredit": "a66f7e80-0370-11ee-be56-0242ac120002",
    "tranferTypeId": 1,
    "value": 120
  }
}
```

<b>Resultado:</b> La petición devolvera un uuid perteneciente a la transacción, el cual debemos copiar en query para traer el status de esta transacción.

<p align="center">
    <img src="https://i.postimg.cc/FFc6PCc3/resultado-command.png"/>
</p>

#### Adaptador de entrada resolver

En codigo debemos ir a nuestro adaptador para peticiones graphql llamado <b>transaction.resolver.ts</b>, este parsea el input a un command y se llamada a un <b>commandBus</b> para que ejecute nuestro command.

<p align="center">
    <img src="https://i.postimg.cc/vmgk7mQ7/resolver-command.png"/>
</p>

#### Manejador de command CreateTransacction

Se define un manejador del command llamado <b>create-transaction.handler.ts</b> unicado en el modulo de <b>command.module.ts</b> para manejar el comand el cual llama a nuestro caso de uso create-transaction.usecase.ts para guardar nuestra transacción en nuestra base de datos <b>postgres</b>, luego si todo va bien nosgenera un código uuid para nuestra transacción con un status <b>created</b> el cual sera enviado atravez de kafka al microservcio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/RVSYsdSZ/command-handler.png"/>
</p>

#### Manejador de event TransactionCreatedEvent

Para este proceso se define un <b>eventBus</b> y aqui es donde enviamos nuestro objeto a un tópico de kafka que sera leido en el microservicio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/Gt5vjb3Y/event-kafka-send-create-transaction.png"/>
</p>

<p align="center">
    <img src="https://i.postimg.cc/0y2Ljsbv/use-case-create-transaction.png"/>
</p>

#### Adaptador de salida TypeOrmEntityRepositoryAdapter

La capa de acceso a datos puede ser cambiada por otro framework como ventaja de usar una arquitectua hexgonal.

<p align="center">
    <img src="https://i.postimg.cc/3NXkbpTg/typeorm-adapter-command.png"/>
</p>

#### Adaptador de entrada para eventos KafkaMessageBrokerEvent

Para escuchar la respuesta del proceso del status de nuestra transacción creamos un adaptador de entrada para eventos escuchando sobre el tópico donde vendra el status desde el microservicio <b>antifraud-service</b>, este creara un command para actualizar el status de la transacción en nuestra base de datos <b>postgres</b>

<p align="center">
    <img src="https://i.postimg.cc/G3Krzq0X/adaptador-kafka-create-transaction.png"/>
</p>


### Módulo queries

Módulo encargado unicamente de obtener datos, este se conecta a una base de datos mongodb que esta sincronizada con nuestra base de datos postgres, la sincronización se hace a traves de Kafka usando un tópico para ello. Al igual que el módulo command sigue la misma arquitectura pero como se explico antes obtiene la data de una base de datos diferente, previamente sincronizada.

<p align="center">
    <img src="https://i.postimg.cc/X7rhF8nG/graphql-query-peticion.png"/>
</p>

```javascript
query GetTransaction($filter: GetTransactionInputType!) {
  getTransaction(filter: $filter) {
    transactionExternalId,
    transactionType {
      name
    },
    transactionStatus {
      name
    },
    value,
    createdAt
  }  
}
```

<p align="center">
    <img src="https://i.postimg.cc/Z5cMzDcQ/graphql-query-param.png"/>
</p>


```javascript
{
  "filter": {
    "transactionExternalId": "4eccc011-ff7a-4c79-a971-bf1457cfecd4"
  }
}
```

El código transactionExternalId es el código resultante de la mutación <b>createTransaction</b> explicada anteriormente.

<b>Resultado: </b>Obtendremos el status de la trasacción procesada por el microservicio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/jdXYcqnG/result-query.png"/>
</p>

<b>Nota:</b> El patron CQRS nos permite separar commands y queries el cual es ideal para manejar grandes volumenes de datos, para su respectiva lectura y escritura.

<p align="center">
    <img src="https://i.postimg.cc/k42CHNCz/syncro.png"/>
</p>

## Microservicio antifraud-service

Este microservicio ejecuta la lógica de negocio de procesar y devolver el estado de la transacción, como se indica puede devolver los estados: <b>approved</b> o <b>rejected</b>, este usa kafka como broker para procesar la transacción creada en el microservicio <b>transaction-service</b> y devolver una respuesta donde esta el status correspondiente.

Este sigue los mismo pasos que el anterior dado que estan implementados con la misma arquitectura, la logica para procesar una peticion es un simple algoritmo que devuelve un valor random con el valor <b>approved</b> o <b>rejected</b>


<p align="center">
    <img src="https://i.postimg.cc/NjcRks1h/antifraud-logic.png"/>
</p>

<b>Nota: </b>Se le agrego un delay de 6000 ms para simular un proceso, tiempo que debe considerar para hacer las respectivas pruebas.

## HttpFilter, AppMiddleware

Se ha definido interceptores para manejar las excepciones de negocio y dado el requisito de que las transacciones solo deben durar 1000 ms se creo un AppMiddleware que se encarga de esta tarea.

## Despliegue

Para levantar los microservicios ubicarse en la carpeta raiz del repositorio y ejecutar el siguiente comando:

```bash
sudo docker-compose up --build
```

<b>Author:</b> Luis Miguel Amat Calderon# Solución reto técnico

Para la solución al reto técnico se han desarrollado dos microservicios: <b>transaction-service</b> y <b>antifraud-service</b> con NodeJs v18.12.1, NestJs v9.0.0 y TypeOrm v9.0.1.

## Microservicio transaction-service

### Módulo commands

Este microservicio ejecuta la lógica de negocio de crear una transacción y recuperar la transacción creada, se ha utilizado Graphql y se ha implementado el patró   n CQRS por lo que se ha creado dos módulos: <b>commands</b> y <b>queries</b>, tambien se ha montado una base de datos <b>postgres v14</b> para ejecutar altas y bajas, es decir, comandos CREATE, UPDATE, DELETE y una base de datos <b>mongo</b> para realizar todas las QUERY, adicionalmente se a implementado el microservicio con una arquitectura <b>hexagonal</b> o una arquitectura de <b>puertos</b> y <b>adaptadores</b>.

#### Petición graphql

Para crear una transacción lo podemos hacer haciendo uso de un cliente como postman o el propio playground de graphql, que para entornos de desarrollo puede activarse y para entornos de producción debe estar desactivado. Para acceder al playground debe ir a la siguiente ruta <b>http://localhost:3000/graphql</b>

<p align="center">
    <img src="https://i.postimg.cc/zDS3NznG/mutacion-create-transaction.png"/>
</p>

```javascript
mutation CreateTransaction($transaction: NewTransactionInputType!) {
  createTransaction(transaction: $transaction) {
    transactionExternalId
  }
}
```

<p align="center">
    <img src="https://i.postimg.cc/qMcknjmB/body-mutation-create-transaction.png"/>
</p>


```javascript
{
  "transaction": {
    "accountExternalIdDebit": "a1908148-0370-11ee-be56-0242ac120002",
    "accountExternalIdCredit": "a66f7e80-0370-11ee-be56-0242ac120002",
    "tranferTypeId": 1,
    "value": 120
  }
}
```

<b>Resultado:</b> La petición devolvera un uuid perteneciente a la transacción, el cual debemos copiar en query para traer el status de esta transacción.

<p align="center">
    <img src="https://i.postimg.cc/FFc6PCc3/resultado-command.png"/>
</p>

#### Adaptador de entrada resolver

En codigo debemos ir a nuestro adaptador para peticiones graphql llamado <b>transaction.resolver.ts</b>, este parsea el input a un command y se llamada a un <b>commandBus</b> para que ejecute nuestro command.

<p align="center">
    <img src="https://i.postimg.cc/vmgk7mQ7/resolver-command.png"/>
</p>

#### Manejador de command CreateTransacction

Se define un manejador del command llamado <b>create-transaction.handler.ts</b> unicado en el modulo de <b>command.module.ts</b> para manejar el comand el cual llama a nuestro caso de uso create-transaction.usecase.ts para guardar nuestra transacción en nuestra base de datos <b>postgres</b>, luego si todo va bien nosgenera un código uuid para nuestra transacción con un status <b>created</b> el cual sera enviado atravez de kafka al microservcio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/RVSYsdSZ/command-handler.png"/>
</p>

#### Manejador de event TransactionCreatedEvent

Para este proceso se define un <b>eventBus</b> y aqui es donde enviamos nuestro objeto a un tópico de kafka que sera leido en el microservicio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/Gt5vjb3Y/event-kafka-send-create-transaction.png"/>
</p>

<p align="center">
    <img src="https://i.postimg.cc/0y2Ljsbv/use-case-create-transaction.png"/>
</p>

#### Adaptador de salida TypeOrmEntityRepositoryAdapter

La capa de acceso a datos puede ser cambiada por otro framework como ventaja de usar una arquitectua hexgonal.

<p align="center">
    <img src="https://i.postimg.cc/3NXkbpTg/typeorm-adapter-command.png"/>
</p>

#### Adaptador de entrada para eventos KafkaMessageBrokerEvent

Para escuchar la respuesta del proceso del status de nuestra transacción creamos un adaptador de entrada para eventos escuchando sobre el tópico donde vendra el status desde el microservicio <b>antifraud-service</b>, este creara un command para actualizar el status de la transacción en nuestra base de datos <b>postgres</b>

<p align="center">
    <img src="https://i.postimg.cc/G3Krzq0X/adaptador-kafka-create-transaction.png"/>
</p>


### Módulo queries

Módulo encargado unicamente de obtener datos, este se conecta a una base de datos mongodb que esta sincronizada con nuestra base de datos postgres, la sincronización se hace a traves de Kafka usando un tópico para ello. Al igual que el módulo command sigue la misma arquitectura pero como se explico antes obtiene la data de una base de datos diferente, previamente sincronizada.

<p align="center">
    <img src="https://i.postimg.cc/X7rhF8nG/graphql-query-peticion.png"/>
</p>

```javascript
query GetTransaction($filter: GetTransactionInputType!) {
  getTransaction(filter: $filter) {
    transactionExternalId,
    transactionType {
      name
    },
    transactionStatus {
      name
    },
    value,
    createdAt
  }  
}
```

<p align="center">
    <img src="https://i.postimg.cc/Z5cMzDcQ/graphql-query-param.png"/>
</p>


```javascript
{
  "filter": {
    "transactionExternalId": "4eccc011-ff7a-4c79-a971-bf1457cfecd4"
  }
}
```

El código transactionExternalId es el código resultante de la mutación <b>createTransaction</b> explicada anteriormente.

<b>Resultado: </b>Obtendremos el status de la trasacción procesada por el microservicio <b>antifraud-service</b>

<p align="center">
    <img src="https://i.postimg.cc/jdXYcqnG/result-query.png"/>
</p>

<b>Nota:</b> El patron CQRS nos permite separar commands y queries el cual es ideal para manejar grandes volumenes de datos, para su respectiva lectura y escritura.

<p align="center">
    <img src="https://i.postimg.cc/k42CHNCz/syncro.png"/>
</p>

## Microservicio antifraud-service

Este microservicio ejecuta la lógica de negocio de procesar y devolver el estado de la transacción, como se indica puede devolver los estados: <b>approved</b> o <b>rejected</b>, este usa kafka como broker para procesar la transacción creada en el microservicio <b>transaction-service</b> y devolver una respuesta donde esta el status correspondiente.

Este sigue los mismo pasos que el anterior dado que estan implementados con la misma arquitectura, la logica para procesar una peticion es un simple algoritmo que devuelve un valor random con el valor <b>approved</b> o <b>rejected</b>


<p align="center">
    <img src="https://i.postimg.cc/NjcRks1h/antifraud-logic.png"/>
</p>

<b>Nota: </b>Se le agrego un delay de 6000 ms para simular un proceso, tiempo que debe considerar para hacer las respectivas pruebas.

## HttpFilter, AppMiddleware

Se ha definido interceptores para manejar las excepciones de negocio y dado el requisito de que las transacciones solo deben durar 1000 ms se creo un AppMiddleware que se encarga de esta tarea.

## Principios solid

Se han seguido las buenas practicas y se ha implementado la solución tomando como base los principios solid.

## Despliegue

Para levantar los microservicios ubicarse en la carpeta raiz del repositorio y ejecutar el siguiente comando:

```bash
sudo docker-compose up --build
```

<b>Author:</b> Luis Miguel Amat Calderon
