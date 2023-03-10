# Yape Challenge
Realiza el registro de una transacción a través de un microservicio que a la vez invoca a otro microservicio para dictaminar si la operación se aprueba o se rechaza.

Elbaorado con Nestjs / Prisma / PostgreSQL / Docker.

## Compilación

```sh
docker-compose up
```

![Compilación](resources/compilacion.png?raw=true "Compilación")

## Endpoints

API Transactions

| Método | Endpoint | Descripción |
| ------ | ------ | ------ |
| POST | /transactions| Registra una transacción e invoca a la API Frauds. |
| PATCH | /transactions/{transaction-id} | Actualiza el estado: APROBADO o RECHAZADO |

API Frauds

| Método | Endpoint | Descripción |
| ------ | ------ | ------ |
| POST | /frauds/evaluate | Valida la el importe e invoca a la API Transactions para actualizar el estado. |

## Postman

[Collection.json](resources/collection.json)

![Postman](resources/postman.png?raw=true "Postman")