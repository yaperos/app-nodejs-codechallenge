# Anti-fraud microservice
Microservicio que se encarga de realizar un analisis de la transaccion en base a sus datos y establecer el estado de la misma

## Pre requisitos
1. Instalar las librerias del monorepo 
```
npm i
```

2. Levantar el servidor de base de datos y kafka localmente. En la raiz del monorepo ejecutar:
```
docker-compose up
```
## Eventos que escucha
**transaction_created**: consumer que se dispara cuando una transaccion es creada

## Eventos que dispara
**transaction_approved**: Cuando el estado final de la tx es *aprobada*
**transaction_rejecetd**: Cuando el estado final de la tx es *rechazada*

## Variables de entorno
**AMOUNT_APPROVED_TX**: Valor maximo para considerar una transaccion aporbada, default: **1000**
**KAFKA_BROKERS**: Direcciones de los brokers de kafka separados por ','

## Ejecutar localmente
```
npx nx run anti-fraud:serve:development
```