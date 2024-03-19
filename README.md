# Yape Code Challenge :rocket:

# Solución - César Torres Lara :smiley:

# Diagrama de Aplicaciones

![Diagrama de Aplicaciones](URL de  imagen)

# Herramientas

He usado las siguientes herramientas para el desarrollo de mi reto técnico.

<ol>
  <ul><strong>VS Code</strong>: Editor de código fuente</ul>
  <ul><strong>NodeJS</strong>: Entorno de ejecución Javascript</ul>
  <ul><strong>Typescript</strong>: Lenguaje de programación como extensión de Javascript, para el tipado de datos</ul>
  <ul><strong>MongoDB</strong>: Sistema de datos NoSQL para el almacenamientos de datos</ul>
  <ul><strong>Docker</strong>: Virtualiza las aplicaciones en contenedores para ejecutar en diferentes entornos</ul>
  <ul><strong>Docker-compose</strong>: Permite gestionar multicontenedores de Docker mediante un archivo YAML</ul>
  <ul><strong>Kafka</strong>: Proporciona una arquitectura de transmisión de datos entre microservicios</ul>
  <ul><strong>Swagger</strong>: Permite diseñar, construir y documentar APIs de manera sencilla.</ul>   
</ol>


# Requerimientos Previos:

Para poder ejecutar y ver los logs del proyecto, recomiendo descargar **Docker Desktop** para tener una interfaz gráfica mas intuitiva de como se estan manejando los contenedores y ver los logs del sistema.

Link de la página oficial de Docker Desktop para poder descargarlo: https://www.docker.com/products/docker-desktop/

No olvides tener los puertos **3001** y **3002** libres para poder ejecutar los microservicios.

# Instalación y Ejecución

Para poder ejecutar la aplicación debe ubicar en la ruta raiz del proyecto y ejecutar en la consola el siguiente comando: `docker-compose up -d`. De esta forma se empezaran a iniciar en segundo plano los contenedores definidos en el archivo **docker-compose.yml**.

**NOTA:** Para poder entrar como cliente, se hace uso de Swagger donde esta documentado el API REST y así poder crear transacciones de manera manual.

Swagger se encuentra ubicado en `http://localhost:3001/documentation/`.






