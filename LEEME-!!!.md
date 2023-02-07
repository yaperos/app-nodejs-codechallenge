# Guia para iniciar proyectito micros

### En este carpeta he realizado dos microservicios con NestJS y TypeOrm y migraciones. Manejo de Eventos de Kafka, publicacion y subscripcion
#### Se tiene el micro Transaction que tiene los sigueintes comportamientos:
    1- Expone Dos APIS
        - Crear Transaction
        - Consultar Transaction
    2- Publicacion Evento al topico 'transactionCreated' al momento de crear una transaction a trave del api
    3- Subscripcion a topico 'transactionApproved' y 'transactionRejected' el cual desencadena acciones de actualizar el estado de la BD
#### Se tiene el micro antifraude, que realiza
    1 - Esta suscrito al topic 'transactionCreated' donde recibe detalle de la transaccion y segun su logica de negocio lo aprueba o rechaza
    2- Emite eventos a los topicos 'transactionApproved' y 'transactionRejected' segun la logica de negocio

## Como inicializar el proyecto
### 1 - Inicializar Docker con Kafka y Postgres con la configuracion dada
```
 docker-compose up
```
### 2 - Seguir la guia en el micro-transaction , seguir archivo readme.md
        Se pide la creacion manual de la bd 'db_yape' en postgress
        Ejecucion de las migraciones para creacion de tablas y semillas
        Instalacion de dependencias y Ejecucion del micro
        Se adjunta Collection de postman para pruebas
### 3 - Seguir la guia del micro-antifraud, el archivo readme.md
        Instalacion de dependencias y Ejecucion del micro


# Puntos de Mejora
 - Uso de Testing Unitarios
 - Uso de TDD
 - Uso de librerias propias compartidas entre los micros para evitar repiticion de codigo. Ejemplo en interfaces, definicion de eventos, etc.
 - Uso de algunos patrones de diseño , pero sin necesidad de forzar segun la complejidad propia del micro
 - Documentacion de eventos en AsyncApi
 - Documentacion de API con Swagger (Tambien Nest tiene Integrado para generar)
 - Uso de Autenticacion y autorizacion segun corresponda

# Apreciaciones personales
Mi dia a dia laboral consiste la realizacion de micros similares, donde hay mayor orquestacion de eventos, en entorno de GKE de GCP con PUB/SUB, y usando otros servicios de la nube de GCP.
