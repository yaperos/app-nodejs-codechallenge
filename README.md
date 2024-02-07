# Prueba

## Servicios

1. **PostgreSQL**

   - Descripción: Base de datos relacional utilizada escritura

2. **MongoDB**

   - Descripción: Base de datos NoSQL utilizada para lectura
   - cliente ui: http://localhost:8080

3. **Zookeeper**

4. **Kafka**

   - Descripción: Plataforma de streaming distribuido utilizado para emitir eventos entre los ms

5. **Transacciones**

   - Descripción: Servicio que recibe y procesa transacciones, emite eventos de transacciones creadas, soporta
     idempotencia en la creacion.

6. **Anti-Fraude**

   - Descripción: Servicio que escucha eventos de creación de transacciones, evalúa y emite rechazos o aporvaciones
     dependiendo de alguna regla.

7. **Migraciones**
   - Descripción: Servicio que ejecuta automáticamente las migraciones de la base de datos de transacciones.

### Configuración del Entorno

Asegúrate de tener Docker instalado en tu máquina.

### Ejecución del Proyecto

- docker compose up

### Acceso a la Aplicación

- Base URL: http://localhost:3000/transaction
- GraphQL URL: http://localhost:3000/graphql
- Documentación de la API REST: http://localhost:3000/transaction/doc
