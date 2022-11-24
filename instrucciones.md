
# Yape Code Challenge

### Solución
La solución presentada utiliza el patron CQRS (Command Query Responsibility Segregation) dividiendo las responsabilidades de escritura y lectura en 2 bases de datos, mongo para lectura y postgres para escritura ademas la solucion utiliza el componente CQRS de Nestjs facilitando su implementación. Se utiliza querys para leer datos y comands para las demas acciones asi como eventos para sincronizar los datos en ambas bases de datos. La solución utiliza el patron para el almacenamiento de la transaccion y la actualizacion del estado de la transacción.

## Instalación
1. Ejecutar el siguiente comando en ambos proyectos
    ```sh
    npm install
    ```
2. Levantar el docker-compose con el siguiente comando
    ```sh
    docker-compose up -d
    ```
3. Ejecutar los script de la carpeta "database-script"


## Ejecución de microservicios
Para correr los proyectos ejecutar 
```sh
npm run start
```
Para probar la creacion de transacciones realizar una peticion rest de tipo POST a la siguiente URL
*    http://localhost:3003/transaction

Para listar todas las transacciones realizar una peticion de tipo GET a la siguiente URL
*    http://localhost:3003/transaction

Ruta de kafka ui (http://localhost:8080/ui).

## Estructura de carpetas
La estructura de carpetas del proyecto transaction esta dividida de la siguiente manera.

        ├───database
        │   ├───mongo
        │   └───postgres
        └───transaction
            ├───commands
            │   └───handlers
            ├───controller
            ├───dto
            ├───entity
            ├───events
            │   └───handlers
            ├───mapper
            ├───queries
            │   └───handlers
            ├───repository
            └───service

                
