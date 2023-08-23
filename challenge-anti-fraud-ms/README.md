# Card Validation

Prueba tecnica Yapero - AntiFraudMicroService


## Requisitos

- Node.js (versión v14.17.3) o superior
- npm (viene con Node.js)

## Tecnologias

- Node.js versión 18
- npm
- SQRC
- NestMicroservice
- Kafka
- Nest
- Jest
- Eslint

## Instalación

1. Instala las dependencias: `npm install` de preferencia la version del node indicado lineas arriba.

## Descripción

1.  `Transaction-ms` nos envia un value para validación.
2.  emitimos un evento con el status(REJECTED or APPROVED) en base al value y un transactionExternalId.

## Uso

2. Ejecuta el proyecto : `npm run start` -- anteponer sudo en caso sea necesario.

## Unit Test

1. Para correr las unit test en la consola: `npm run test`

## Lint

1. Para correr el lint `npm run lint`
