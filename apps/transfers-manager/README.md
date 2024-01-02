# Transfer-manager microservice
Microservicio que se encarga de todas las operaciones sobre transacciones

## Pre requisitos
1. Instalar las librerias del monorepo 
```
npm i
```

2. Levantar el servidor de base de datos y kafka localmente. Para ello, en la raiz del monorepo ejecutar:
```
docker-compose up
```
## Eventos que escucha
**transaction_approved**: Actualiza el estado de una tx a *APPROVED*
**transaction_rejected**: Actualiza el estado de una tx a *REJECTED*
**create_transaction**: Crea una transaccion en la base de datos
**get_transaction**: consulta los datos de una tx dado su guid

## Eventos que dispara
**transaction_created**: dispara cuando una transaccion se ha insertado en la base de datos

## Variables de entorno
**KAFKA_BROKERS**: Direcciones de los brokers de kafka separados por ','
**DB_HOST**: host del servidor de base de datos, default: localhost
**DB_PORT**: puerto del servidor de base de datos, default: 5432
**DB_USER_NAME**: usuario de conexion a la base de datos, default: postgres
**DB_PWD**: clave de acceso del usuario de conexion a la base de datos, default: postgres
**DB_NAME**: nombre de la base de datos a acceder: default: postgres
**DB_SYNCHRONIZE**: bandera que indica si se debe sincronizar el modelo con la base de datos, **para efectos del ejercicio** se lo deja en **true**


## Ejecutar localmente
```
npx nx run transfer-manager:serve:development
```