# Yape Code Challenge :rocket:
Este proyecto implementa un sistema de validación de transacciones financieras basado en microservicios, siguiendo los lineamientos del **Yape Code Challenge**.

## **Índice**
- [Resumen del Proyecto](#resumen-del-proyecto)
- [Características del Proyecto](#caracteristicas-del-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instrucciones de Despliegue](#instrucciones-de-despliegue)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Pruebas](#pruebas)
- [Checklist de Requisitos Cumplidos](#checklist-de-requisitos-cumplidos)

## **Resumen del Proyecto**
El sistema maneja la creación y validación de transacciones financieras mediante dos microservicios:

**Microservicio de Transacciones:**  
- Permite la creación de transacciones con estado inicial `pending`.  
- Envía el evento `transaction_created` a Kafka.  
- Escucha el evento `transaction_status_updated` para actualizar el estado de la transacción.

**Microservicio Anti-Fraude:**  
- Escucha el evento `transaction_created`.  
- Valida el monto de la transacción:  
  - Si es mayor a 1000 ➔ **`rejected`**  
  - Si es menor o igual a 1000 ➔ **`approved`**  
- Envía el resultado en el evento `transaction_status_updated`.

**Base de Datos:**  
- Se utiliza **Prisma ORM** para la gestión de transacciones en la base de datos.

**Mensajería Asíncrona:**  
- Utiliza **Kafka** para garantizar la escalabilidad y robustez del sistema.

**Autenticación con JWT:**  
- Incluye autenticación mediante tokens JWT.  

## **Características del Proyecto**
- Implementación modular siguiendo principios de **Clean Architecture**.  
- Uso de **TypeScript** para mayor robustez y escalabilidad.  
- Manejo adecuado de errores mediante un middleware personalizado.  
- Sistema de logs centralizado para facilitar el monitoreo del sistema.  
- Contenedores Docker para simplificar el despliegue y la configuración.  
- Pruebas unitarias e integración usando **Jest**.  

## **Instrucciones de Despliegue**
1. Clonar el repositorio.
    - git clone <URL_DEL_REPOSITORIO>
    - cd app-nodejs-codechallenge
2. Deploy del proyecto con Docker
    - docker-compose up
    - Esto iniciará:
        - Microservicio de Transacciones
        - Microservicio Anti-Fraude
        - Kafka
        - Base de Datos

## **Endpoints Disponibles**
1. Login
    - URL: POST /api/public/login

    - Body:
        {
        "username": "admin",
        "password": "admin"
        }

    - Respuesta:
        {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
        }

2. Crear una Transacción
    - URL: POST /api/auth/transactions

    - Headers:
        {
        "Authorization": "Bearer <TOKEN_GENERADO>"
        }

    - Body:
        {
        "accountExternalIdDebit": "guid1",
        "accountExternalIdCredit": "guid2",
        "tranferTypeId": 1,
        "value": 500
        }

3. Consultar el Estado de una Transacción
    - URL: GET /api/auth/transactions/:id

    - Headers:
        {
        "Authorization": "Bearer <TOKEN_GENERADO>"
        }

## **Testing**
Para ejecutar pruebas unitarias
- docker-compose exec app-nodejs-codechallenge-transaction-service-1 npm run test
- docker-compose exec app-nodejs-codechallenge-anti-fraud-service-1 npm run test

## **Checklist de Requisitos Cumplidos ✅**
- Creación de transacciones con estado pending.
- Validación automática de transacciones mayores a 1000 como rejected.
- Envío y recepción de eventos mediante Kafka.
- Uso de Prisma como ORM para la gestión de la base de datos.
- Autenticación mediante JWT para garantizar seguridad y trazabilidad.
- Documentación completa del proyecto.
- Pruebas unitarias para la lógica del negocio.



