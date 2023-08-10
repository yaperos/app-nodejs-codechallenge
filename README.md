Configuración Inicial
En el directorio principal, encontrarás un archivo llamado docker-compose.yml. Simplemente ejecuta docker-compose up para iniciar los contenedores Docker necesarios.

Luego, ve a la carpeta antifraud y ejecuta yarn install para instalar las dependencias necesarias.

En la misma carpeta, usa yarn start:dev para iniciar el servidor. Esto hará que tu aplicación esté lista para funcionar.

Haz lo mismo en el directorio transaction (ejecuta yarn install y yarn start:dev) para el otro componente de la aplicación.

Si deseas personalizar las variables de entorno, ve al directorio ms-transaction y modifica el archivo .env.stage.dev.

Documentación de la API
Abre tu navegador y dirígete a http://localhost:3000/docs. Aquí encontrarás la documentación completa de la API. Esta es una guía que te muestra cómo interactuar con la aplicación.

Para crear una transacción, utiliza POST /transactions y proporciona los detalles requeridos.

Si deseas obtener detalles de una transacción específica, utiliza GET /transactions/{transactionExternalId}. Esto te dará información detallada sobre la transacción.