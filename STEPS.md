# Pasos para correr el proyecto

## Creando contenedores

```shell
docker-compose up -d
```

## Levantando ms-api

```shell
cd ms-api
npm i
npm run start
```

## Levantando ms-anti-fraud

```shell
cd ms-anti-fraud
npm i
npm run start
```

# Consideraciones

- Para que el servicio que crea la transacción funcione, se deben agregar tipos a la bd (transactiontypes) con los campos:
  - id: number
  - name: string

# Mejoras

- Cada microservicio debería tener su propio repositorio y su propio contenedor
- Como kafka trabaja asíncronamente, es posible que en algún punto se trabaje con notificaciones o sockets
- La capa que se conecta a Kafka podría estar en una librería aparte para importar en todos los microservicios
- Ocultar configuraciones en variables de entorno o algún vault