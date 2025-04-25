# Yape Code Challenge :rocket:

# Microservicios de Transacciones

Este proyecto está compuesto por dos microservicios en NestJS que se comunican mediante Kafka. El objetivo es permitir la creación y obtención de transacciones, integrando un sistema de validación antifraude.

## 🧱 Estructura del Proyecto

- `transaction-service`: expone APIs para crear y obtener transacciones.
- `anti-fraud-service`: escucha eventos de creación de transacción y valida el monto.

## 🚀 Requisitos

- Node.js >= 18
- Docker & Docker Compose
- Kafka (incluido en `docker-compose.yml`)

## 🛠️ Instalación

1. Clona el repositorio y navega a la raíz del proyecto.
2. Ejecuta los servicios necesarios con Docker:

```bash
docker-compose up -d
```

## 🛠️ Correr las migraciones

1. Ingresar a la carpeta de transacciones

```bash
cd transaction-service
```

2. Correr las migraciones y semillas necesarias
```bash
npm install
npm run db:run
npm run db:seed
```

## 🛠️ Levantar los proyectos

```bash
cd transaction-service
npm run start:dev

cd anti-fraud-service
npm run start:dev
```

## 🛠️ Ejecutar los servicios, puedes revisar en postman
[localhost: ](http://localhost:3000/api)

## 🛠️ Ejecutar las pruebas unitarias
```bash
cd transaction-service
npm run test

cd anti-fraud-service
npm run test
```