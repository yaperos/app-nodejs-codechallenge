
# Automatico

Tecnología utilizadas:

- Nest js
- Prisma
- Graphql
- kafka

Microservicios:

- antifraud-microservice
- yape-api-gateway

Donde:

antifraud-microservice: 
Microservicio que permite evaluar el    fraude de la transación al momento que se emite el evento de crear transacción indicando si se aprueba o se rechaza la misma.
yape-api-gateway:
Microservicio que se conecta a la base de datos mediante prisma , genera las operaciones de grapqhl para crear la operación, listar una y muchas con el evento que actualiza el estado de la operación creada de microservicio de antifraude.


Requisitos
Se necesita el .env correspondiente en cada servicio
Se necesita docker para levantar la base de datos postgress y kafka

Pasos para prenderlo

Correr el comando del archivo raíz que tiene postgress y kafka
    docker-compose up

En el microservicio yape-api-gateway generar la migración de Prisma
con los comandos:
```bash
    npx prisma migrate dev

    npx prisma generate
```
Instalar las dependencias
```bash
    yarn install
    yarn start:dev
```   

Se ejecuta el playground en el puerto 300 en la ruta:
    http://localhost:3000/graphql

Considerar:

Se tienen dos querys y una mutación

createTransaction
  - Input 
    - value: number
    - transferTypeId: 1,2
      1:INMEDIATE
      2:DEFERED

getTransactionById
  - transactionId: 3 (id de la operación)

getTransactionsWithPagination
  - Input 
    - status: estado de la operación
    - skip: cuantas va saltar para paginar , por ejemplo 20 , sería no considerar los 20 primeros
    - take: el límite por página en este caso , cuanta información va a tomar por query


