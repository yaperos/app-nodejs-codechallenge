
# Yape Code Challenge

## Instalación
1. Instalar las depedencias con el sgte comando. (en cada proyecto, transaction y anti-fraud)
    ```sh
    npm install
    ```
2. Habilitar el ambiente de desarrollo con el sgte comando con docker ejecutándose. (en cada proyecto, transaction y anti-fraud)
    ```sh
    docker-compose up -d
    ```
2. Si es necesario generar el /dist con el sgte comando. (en cada proyecto, transaction y anti-fraud)
    ```sh
    npm run build
    ```
3. Ejecutar los script de la carpeta "database-script"

3. Para tener listos los endpoints de consulta, importar el archivo yape-challenge.postman_collection.json en POSTMAN


## Ejecución de microservicios
Para correr los proyectos ejecutar (en cada proyecto, transaction y anti-fraud)
```sh
npm run start
```

Ruta de kafka ui (http://localhost:8080/ui).