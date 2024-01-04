# api-gateway microservice
Servicio que enruta las llamdas a los mciroservicios. Creado con la finalidad de poder probar el ejercicio y mostrar como se compone una arquitectura orientada a Eventos

## Pre requisitos
1. Instalar las librerias del monorepo 
```
npm i
```

2. Levantar los microservicio **anti-fraud** y **transfer-manager**. Referirise a cada README.md de cada micro servicio.

## Variables de entorno
**KAFKA_BROKERS**: Direcciones de los brokers de kafka separados por ','
**PORT**: puerto de escucha del servidor de applicaciones 
**REDIS_URL** : Url del servidor de redis para  manejo de cache
**REDIS_GLOBAL_TTL**: time to live global para manejo de cache
**GET_TX_BY_ID_TTL**: time to live para el metodo get transaction by id

## endpoint expuestos
1. POST /api/v1/transaction

```
curl --location 'http://localhost:3000/api/v1/transaction' \
--header 'Content-Type: application/json' \
--data '{
      "accountExternalIdDebit": "0e5cd5dc-5d89-49a4-b248-c6f4d96ea662",
      "accountExternalIdCredit": "08f5a09b-3330-4fee-aaa4-b260988b5f78",
      "tranferTypeId": 1,
      "value": 2000
 }'
``` 
response
```
{
    "message": "Transaccion creada correctamente",
    "data": {
        "transactionId": "ebe0b675-69bd-44cf-8565-73d066a74437"
    }
}
```
2. GET /api/v1/transaction
```
curl --location 'http://localhost:3000/api/v1/transaction/d4fdb02f-28ad-4edb-b0b7-38fb9aa3d68a'
```
response
```
{
    "createdAt": "2024-01-02T14:34:42.417Z",
    "transactionExternalId": "2cdb3e2e-8d17-436f-b48f-df143bc5482a",
    "transactionStatus": {
        "name": "PENDING"
    },
    "transactionType": {
        "name": "1"
    },
    "value": "$100.00"
}
```

## Ejecutar localmente
```
npx nx run api-gateway:serve:development
```