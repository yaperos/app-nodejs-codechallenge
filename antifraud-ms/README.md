# Anti-Fraud Service

Microservicio que se encarga de validar las transacciones y determinar si se **aprueban** o **rechazan**.

## Tecnologías principales
- [NestJS](https://nestjs.com/) (modo microservicio con Kafka)
- [Kafka (AWS MSK)](https://aws.amazon.com/msk/)
- [Serverless Framework](https://www.serverless.com/) (opcional si se despliega como Lambda)

## Flujo
1. Escucha mensajes del tópico `transaction-created-topic`.
2. Valida el valor de la transacción (si `value > 1000`, se rechaza; en caso contrario, se aprueba).
3. Publica el resultado en el tópico `transaction-status-updated-topic`.

## Requisitos
- Node.js 20+
- npm o yarn
- Serverless CLI (si deseas desplegar en AWS Lambda)
- Kafka corriendo local o en AWS MSK

