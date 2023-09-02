# PruebaTocToc 🚀

## Introducción 📋
Este es el desarrollo de la prueba de Yape, hecho por mi

## Pasos para correr el proyecto 🦾

1. Clonar el repositorio

    ```bash
    git clone https://github.com/natobo/app-nodejs-codechallenge.git
    ```
2. Ejecutar el siguiente comando de docker (Nota: por asuntos de concurrencia, esperar 30 segundos a que se inicien todos los contenedores, luego si probar)

    ```bash
     docker compose up --build
    ```
3. Importar las rutas de los endpoints de la carpeta collections con la extensión ThunderClient para realizar las peticiones Rest y probar la aplicación. Existen 5 rutas, 4 relacionadas con crear la transacción y 1 para probar que el servidor esta activo.

## Notas importantes del desarrollador
- Para volver a ejecutar la prueba de 0 es buena idea borrar la carpeta data con los mounts de los contenedores y ejecutar ```docker builder prune```
- Si sigue molestando pese a hacer el paso anterior usar: ```docker system prune -a```, **SI Y SOLO SI** no se tienen imagenes/contenedores importantes
- Algunas veces ```anti-fraud-ms``` molesta porque se ejecuta primero que el contenedor ```transaction-ms```, en esos casos solo es necesario parar la ejecución y volver a correr el docker compose up
   
## Links relacionados 📖
- [Extensión Thunder Client](https://www.thunderclient.com/)
