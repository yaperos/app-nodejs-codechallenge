# Transaction Service

Este proyecto corresponde al **Microservicio de Transacciones** que permite:

1. Crear una transacción (estado inicial: PENDING).
2. Consultar una transacción por su ID.
3. Publicar eventos en Kafka (AWS MSK) para notificar la creación de transacciones.

## Tecnologías utilizadas
- [NestJS](https://nestjs.com/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [Kafka (AWS MSK)](https://aws.amazon.com/msk/)
- [Serverless Framework](https://www.serverless.com/)
- [Docker](https://www.docker.com/) (opcional para entornos locales)

## Requisitos previos
- Node.js 20+
- npm
- Serverless CLI (`npm install -g serverless`)
- Credenciales de AWS configuradas (si deseas desplegar en AWS)
