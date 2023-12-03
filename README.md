# Sistema de Validación Antifraude de Yape

Este proyecto, alojado en [app-nodejs-codechallenge](https://github.com/mig8at/app-nodejs-codechallenge), contiene dos microservicios - `yape` y `antifraud`. Estos servicios trabajan juntos para gestionar y validar transacciones, formando un sistema de validación antifraude.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente:
- Node.js (versiones recientes)
- NestJS CLI
- Docker
- Un editor de código (recomendado: Visual Studio Code)

## Configuración del Proyecto

Sigue estos pasos para configurar el proyecto:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/mig8at/app-nodejs-codechallenge
   cd app-nodejs-codechallenge
## Instalar Dependencias:

```bash
$ pnpm install
```

## Levantar Servicios con Docker:
Utiliza el archivo docker-compose.yml incluido para configurar y ejecutar servicios como Kafka y PostgreSQL:

```bash
$ docker-compose up -d
```

# Ejecución del Proyecto
Para ejecutar los microservicios localmente:

## Microservicios:
```bash
# unit yape
$ npm run start:yape

# init antifraud 
$ npm run start:antifraud
```

## Pruebas
Ejecuta las pruebas con el siguiente comando:
  
  ```bash
  $ npm run test
  ```
# Estructura del Proyecto

*  **apps/yape**: Contiene el código fuente del microservicio yape.
* **apps/antifraud**: Contiene el código fuente del microservicio antifraud.
* **docker-compose.yml**: Define servicios como Kafka y PostgreSQL.