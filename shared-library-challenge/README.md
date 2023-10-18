# Librería Proyecto Yape Challenge 
Esta libreria de Eventos y Tipos Compartidos es un paquete de npm diseñado para almacenar y compartir eventos y tipos que deben ser utilizados entre los microservicios del challenge. Esta librería facilita la comunicación y el intercambio de información estructurada de manera consistente.

## Instalación

Puedes instalar la librería ejecutando el siguiente comando:
````shell
npm install shared-library-challenge
````

## Topicos de Kafka
Se tienen las siguientes eventos en el enum.
El valor es el nombre del topico asociado
````ts
// Nombres de temas de Kafka
export enum EventsEnum {
  transactionApproved = 'transactionApproved',
  transactionRejected = 'transactionRejected',
  transactionCreated = 'transactionCreated',
}
````

## Se tiene las clases de eventos
### Transaccion Creada
Se emite al crearse una transaccion en el micro 'transactions'

````ts
import { TransactionCreatedEvent } from "./transaction-created.event";
// import and use
let event=new TransactionCreatedEvent({transaction_external_id:'uuidv4',value:100})
// send event
// kafkaproducer.send(event)
````

### Transaccion Aprobada
Se emite al aprobarse una transaccion, es emitida desde el micro 'antifraud', luego es consumida en el micro transactions

````ts
// - On Micro Antifraud
import { TransactionApprovedEvent } from "./TransactionApprovedEvent";
let event =new TransactionApprovedEvent({transaction_external_id:'uuid of transaction'})
// send event
// kafkaproducer.send(event)
````
### Transaccion Rechazada
Se emite al rechazarse una transaccion, es emitida desde el micro 'antifraud', luego es consumida en el micro transactions

````ts
// - On Micro Antifraud
import { TransactionRejectedEvent } from "./TransactionRejectedEvent";
let event =new TransactionRejectedEvent({transaction_external_id:'uuid of transaction'})
// send event
// kafkaproducer.send(event)
````
