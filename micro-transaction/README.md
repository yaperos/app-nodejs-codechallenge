# Micro-transacciones
Expone 2 apis , crear y consultar transaccion. Se adjunta Postman collection (buscar).
Emite evento al topico 'transactionCreated' al crear una transaccion
Esta Suscrito a los topicos 'transactionApproved' y 'transactionRejected' donde segun sea el caso actualiza el estado de la transaccion.


## 1 - Instalar dependencias de este proyecto enn cmd ejecutar
   ```
    npm install
   ```
## 2 - Conectarse a Postgres desde DBMS o consola y crear manualmente una DB llamada 'db_yape'. (Si ya existe borrar)
```
create database db_yape;
```
## 3 - Ejecutar las migraciones de typeorm crea tablas y carga data inicial de tablas
```
npm run m:run
```
## 4 - Iniciar Aplicacion
```
npm run start:dev
```
## 5 - Llamar a la api de crear transaccion (Se adjunta en esta carpeta coleccion de postman: Changelle Yape.postman_collection.json )

##### Crear transaccion
```
curl --location --request POST 'http://localhost:3000/transaction' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'accountExternalIdDebit=9035832f-5590-4e93-b13e-0f68b81217a7' \
--data-urlencode 'accountExternalIdCredit=4f60f1ad-9f4d-4448-8e7c-bb363f9e345f' \
--data-urlencode 'tranferTypeId=1' \
--data-urlencode 'value=1000'
```
#### Consultar transaccion
```
curl --location --request GET 'http://localhost:3000/transaction/c3b6aa1b-979d-4839-8a92-f2f4118f68d5'
```



