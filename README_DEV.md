# Transaction Microservice - Development Guide

Este documento explica cómo levantar el proyecto en un entorno de desarrollo y cómo probar la API de transacciones y el servicio antifraude.

---

## Requisitos

- Docker & Docker Compose
- Postman o `curl` para probar la API
- Navegador para acceder a la interfaz web y PgAdmin

---

## Levantar el proyecto

1. Clonar el repositorio:
   ```bash
   git https://github.com/lordjeferoon2/app-nodejs-codechallenge.git
   cd app-nodejs-codechallenge
   ```

2. Levantar todos los servicios usando Docker Compose:
   ```bash
   docker-compose up --build
   ```
   Esto levantará:
   - La API de transacciones (`localhost:8081`)
   - Base de datos PostgreSQL
   - PgAdmin (`localhost:5050`)
   - Frontend web (`localhost:4300`)
   - Otros servicios necesarios (antifraude, etc.)

---

## Probar la API de transacciones

### 1. Obtener los UUID de las cuentas

- Accede a PgAdmin en: [http://localhost:5050](http://localhost:5050)
- Credenciales:
  ```
  Email: admin@admin.com
  Password: admin
  ```
- Navega hasta la base de datos y la tabla `accounts`.
- Copia los UUID de las cuentas que se han creado (por ejemplo Juan Perez y Karla Rojas) y úsalos en el payload.

### 2. Hacer la petición `curl` de prueba

```bash
curl --location 'http://localhost:8081/api/transactions' --header 'Content-Type: application/json' --data '{
  "accountExternalIdDebit": "UUID_DE_LA_CUENTA_DEBITO",
  "accountExternalIdCredit": "UUID_DE_LA_CUENTA_CREDITO",
  "transferTypeId": 1,
  "value": 300.0
}'
```

> Reemplaza `UUID_DE_LA_CUENTA_DEBITO` y `UUID_DE_LA_CUENTA_CREDITO` por los UUID obtenidos desde PgAdmin.

---

## Probar usando la interfaz web

1. Accede a la web: [http://localhost:4300](http://localhost:4300)
2. Encontrarás los usuarios generados automáticamente:
   - Juan Perez
   - Karla Rojas
3. Desde la interfaz puedes realizar transferencias y probar el **servicio antifraude** directamente.

---

## Notas adicionales

- Todas las operaciones iniciales de la base de datos (borrado de registros y creación de cuentas) se realizan automáticamente al iniciar la aplicación.
- El servicio antifraude se ejecuta en paralelo y valida las transacciones en tiempo real.
- Si cambias los UUID en la base de datos, asegúrate de actualizar el payload de las pruebas.

---