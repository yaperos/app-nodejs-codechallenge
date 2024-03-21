
# Financial Transactions Service

Este proyecto es un servicio para gestionar transacciones financieras. Las transacciones creadas deben ser validadas por un microservicio anti-fraude y luego el mismo servicio envía un mensaje de vuelta para actualizar el estado de la transacción.

## Requerimientos del Proyecto

- Cada vez que se crea una transacción financiera, debe ser validada por el microservicio anti-fraude.
- Las transacciones pueden tener uno de los siguientes estados: pendiente, aprobada o rechazada.
- Las transacciones con un valor superior a 1000 deben ser rechazadas.

## Tecnologías Utilizadas

- Node.js con el framework NestJS y TypeORM para el backend.
- Base de datos PostgreSQL para almacenar las transacciones.
- Kafka para la mensajería entre microservicios.

## Instalación y uso

- Clonar este repositorio en el equipo local:

```bash
git clone https://github.com/briceno-richard/app-nodejs-codechallenge.git
```
- Instalar las dependencias del proyecto utilizando npm:

```bash
cd app-nodejs-codechallenge/transaction-service
npm install
```
- Ejecutar las migraciones:

```bash
npm run typeorm:migrate
```
- Iniciar la aplicación

```bash
npm run start
```

## Pruebas

Para ejecutar las pruebas unitarias, utilizar el siguiente comando:
```bash
npm run test
```