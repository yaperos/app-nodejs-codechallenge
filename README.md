# Yape Code Challenge

Solución para el reto técnico de Yape.

## Descripción

El sistema consta de dos microservicios desacoplados que se comunican de forma asíncrona. El objetivo es procesar transacciones de alto volumen y validar reglas de negocio antifraude sin bloquear la respuesta al cliente.

### Flujo de la Aplicación
1.  **Transaction Service** recibe una solicitud HTTP para crear una transacción.
2.  La transacción se guarda en **MySQL** con estado `PENDING`.
3.  Se emite un evento `transaction_created` a **Kafka**.
4.  **Anti-Fraud Service** consume el evento y valida el monto.
5.  Si el valor es **> 1000**, se rechaza (`REJECTED`); de lo contrario, se aprueba (`APPROVED`).
6.  Se emite un evento `transaction_status_update` de vuelta.
7.  **Transaction Service** actualiza el estado final en la base de datos.

## Tecnologías

* **Node.js & NestJS**: Framework principal (Modo Híbrido: HTTP + Microservice).
* **Apache Kafka**: Message Broker para comunicación asíncrona.
* **MySQL**: Base de datos relacional.
* **Prisma ORM**: Gestión de esquemas y migraciones automáticas.
* **Docker & Docker Compose**: Orquestación de contenedores y entorno de desarrollo.

## Instalación y Ejecución

### Prerrequisitos
* Docker
* Git

### Pasos
1.  Clona el repositorio:
    ```bash
    git clone <url-del-repo>
    cd <nombre-del-repo>
    ```

2.  Ejecuta el entorno con Docker Compose:
    ```bash
    docker-compose up --build
    ```

3.  Verifica que los servicios estén corriendo:
    * **API Transaction:** `http://localhost:3000`
    * **Kafka UI (Opcional):** `http://localhost:8080` 

## Uso de la API

Puedes probar los endpoints usando `curl` o Postman.

### 1. Crear una Transacción

Envia una transacción. Si el `value` es mayor a 1000, será rechazada.

**Request:**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "28608054-47b6-4522-9214-722e0322b270",
    "accountExternalIdCredit": "28608054-47b6-4522-9214-722e0322b271",
    "transferTypeId": 1,
    "value": 120
  }'
```

### 2. Consultar una Transacción
Usa el transactionExternalId (UUID) que recibiste en la respuesta anterior para ver su estado final.

**Request:**

```bash
curl http://localhost:3000/transactions/{TU-UUID-AQUI}
```
Respuesta Exitosa (Aprobada):

```JSON
{
  "transactionExternalId": "1f0bfb31-4577-4755-8253-60ea07d0273e",
  "transactionType": {
    "name": "1"
  },
  "transactionStatus": {
    "name": "APPROVED"
  },
  "value": 120,
  "createdAt": "2025-12-13T20:31:23.691Z"
}
```