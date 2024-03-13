# Yape Code Challenge :rocket:

Hola, Bienvenidos!

Para comenzar primero deben:

-Iniciar Docker, en la carpeta donde se encuentra el archivo docker-compose.yml:
```
docker-compose up
```
Puedes verificar los ambientes correctamente trabajando con el siguiente comando:
```
docker-compose ps
```
-Iniciar el server, en la carpeta /Transaction-Service ejecutar:
```
npm run dev
```
-Iniciar kafka, en la carpeta /Antifraud ejecutar:
```
npm run dev
```

Vas a necesitar alguna herramienta como POSTMAN para probar las siguientes rutas:

POST: "localhost:3000/api/transaction/create"

Informacion en el body:
```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```
Respuesta al POST: 
```json
{
    "message": "Success",
    "results": {
        "transactionExternalId": "87ed6981-8d56-4b78-bbc2-7be24b99942b",
        "tranferStatusId": 1,
        "createdAt": "2024-03-13T13:48:31.732Z",
        "id": 1,
        "accountExternalIdDebit": "Guid",
        "accountExternalIdCredit": "Guid",
        "tranferTypeId": 1,
        "value": 770
    }
}
```
GET: "localhost:3000/api/transaction/:id"

El id param en este caso es el "transactionExternalId" que devuelve en la respuesta del POST.

En este get podremos observar el estado de la transacción:

```json
{
    "message": "Success",
    "results": {
        "transactionExternalId": "87ed6981-8d56-4b78-bbc2-7be24b99942b",
        "transactionType": {
            "name": "Other"
        },
        "transactionStatus": {
            "name": "Approved"
        },
        "value": 770,
        "createdAt": "2024-03-13T13:48:31.732Z"
    }
}
```

Gracias por leer, no duden en consultar!