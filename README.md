# Yape Code Challenge :rocket:

Titulo : Prueba Tecnica Yape con NestJS TypeORM GraphQL Kafka 

NOTA: Hay un diagrama al mismo nivel desde este readme para poder apreciar la arquitectura que se uso para la implementacion de esta prueba Tecnica


Estructura del Proyecto
El proyecto se divide en dos microservicios:

ms-transaction: Este microservicio se encarga de la creación y recuperación de transacciones.
ms-antifraud: Microservicio anti-fraude que valida transacciones y actualiza su estado.
Tecnologías Utilizadas
NestJS: Utilizado como el marco de aplicación principal para desarrollar los microservicios. Proporciona una estructura modular y escalable.
TypeORM: ORM (Object-Relational Mapping) utilizado para interactuar con la base de datos y modelar las entidades de transacción.
GraphQL: Implementado para proporcionar una interfaz flexible para la creación y recuperación de transacciones.
Kafka: Sistema de mensajería utilizado para facilitar la comunicación entre los microservicios y mantener la consistencia de datos.


Dependecias: 
- KafkaJS
- TypeORM
- Graphql con Apolo

En el proyecto de ms-transactions utlizaremos este comando para instalar las dependecias:
npm install kafkajs typeorm @nestjs/graphql apollo-server-express
en el proyecto de ms-antifraud solo necesitaremso el kafkajs:
npm install kafkajs

Solucion:

1.- Primero comentar que se utilizo una sencilla arquitectura de N capas para resolver esta Prueba tecnica en donde se enfoco la comunicacion de ambos microservicios con Kafka
2.- Se utilizo el esquema de CODE FIRST de GraphQL para poder crear nuestro RESOLVERS y crear nuestras Mutations para la creacion de las transacciones 
RUTA: http://localhost:3000/graphql

Json de Mutation :
mutation {
  createTransaction(createTransactionInput: {
    accountExternalIdCredit: "someCreditId",
    accountExternalIdDebit: "someDebitId",
    tranferTypeId: 1,
    value: 953
  }) {
    transactionExternalId
    value
    createdAt
  }
}

RESPONSE: {
  "data": {
    "createTransaction": {
      "transactionExternalId": "98439c07-c5ca-4c18-837e-681cb6ae278a",
      "value": 953,
      "createdAt": "2024-01-31T07:07:00.506Z"
    }
  }
}

3.- Luego se procedio a instalar las dependencias de TYPEORM para poder crear nuestro servicios en donde primero se verifico que estos servicios funcionen correctamente con GRAPHQL y los resolvers.
4.- Se implemento la configuracion de Kafka en donde se implmentaron los CONSUMERS Y PRODUCERS siendo el topico que enviara la transaccion al antifraude "transaction-emitter" y el que se encargara de regresar el evento con el status corregido el topico "topicofantrifraud"
5.- Luego de configurar los topicos y bien el modulo de kafka pasamos a implemnetar esa logica de emitir en el microservicio de ms-transactions en donde produciremos el evento para el ms-antifraud en donde ahi con el metodo consumer recibiremos los topicos de esa red de mensajeria para Luego
poder evaluarlo y luego de evaluarlo poder emitir en la red del topico de topicofantrifraud la transaccion con el status de rechazado o aprobado
6. Finalmente cuando recibimos en el ms-transaction en la linea del topico "topicofantrifraud" utilizando el servicio Update de TYPEORM cambiamos el status al que nos dio la evaluacion del ms-antifraud logrando asi una comunicacion Efectiva y Exitosa
