```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```
## Tecnologías:
NestJS: Debido a que utiliza TypeScript, lo cual facilita mucho el desarrollo, además de ser bastante escalable y estar basado en Express, el framework más utilizado en el backend con NodeJS.

- **PostgreSQL:** Decidí utilizar una base de datos relacional debido a que, como es un proyecto relacionado con usuarios, cuentas y transacciones, en su mayoría finanzas, creo que una base de datos relacional nos da una mejor forma de organizar este tipo de datos.

- **GraphQL:** Utilicé GraphQL como respuesta a la mejora que se necesitaba para lidiar con la alta carga de escritura y lectura. Un API GraphQL es perfecto para lidiar con esto.

## Proyecto:
El proyecto lo he separado en dos partes principales, debido a que tienen responsabilidades distintas y se pueden iniciar como servicios separados o con más o menos recursos según se requiera.

### api-transactions:
Tiene como responsabilidad principal exponer el API y, en su defecto, realizar los cambios en la base de datos. Se conecta al microservicio de `anti-fraud-system`, emite el evento de creación y escucha los de aceptado y/o rechazado.

### anti-fraud-system:
Como se mencionó en el reto, el API debe conectarse a un microservicio de validación de anti-fraude. Realicé esto separado, el cual se encarga de escuchar la creación de transacciones y realizar algunas validaciones, incluida la del límite de 1000. Sé que esto puede tener una lógica más compleja o incluso usar un servicio externo de validación anti-fraude, pero intenté aplicar una lógica sencilla para simular esto.

## Iniciando el proyecto:
Considera como puntos principales agregar el archivo `.env` y también iniciar las dos aplicaciones `anti-fraud-system` y `api-transactions`. A continuación, se explica el orden y con más detalle.

```bash
# Instalar dependencias
$ npm install

# Agregar el .env. Para facilitar el tema de la prueba se puede duplicar
# directamente el archivo .env.example los datos son los mismos
# NOTA: en producción no se debe compartir este tipo de datos.
$ cp .env.example .env

# Iniciar los contenedores necesarios para probar el servicio
$ docker-compose up

# Verificar que los contenedores esten ejecutandose correctamente
$ docker ps

$ docker restart # (Solo si es necesario) en ocaciones el servicio de kafka se cierra

# NOTE: Importante iniciar hambos proyectos para iniciar el flujo completo
# Para probar el proyecto he creado un seeder que inserta los registros necesarios como estados/typos de transacion, ejecutar lo siguiente:
$ npm run seed-data

# Modo desarrollo
$ npm run start:dev
$ nest start anti-fraud-system --watch

# Modo Producción
$ npm run start:prod
$ nest start anti-fraud-system
```
