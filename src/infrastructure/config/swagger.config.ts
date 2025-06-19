import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Yape Code Challenge - API de Transacciones')
    .setDescription(`
      Servicio de Transacciones Financieras con Integración de Anti-Fraude
      
      Esta API gestiona transacciones financieras con las siguientes características:
      - Crear transacciones (siempre comienzan como pendientes)
      - Recuperar detalles de la transacción
      - Validación automática de anti-fraude via Kafka
      - Actualizaciones de estado de la transacción (aprobada/rechazada)
      - Regla: Las transacciones > 1000 son automáticamente rechazadas
      
      Construido con:
      - Node.js + NestJS
      - PostgreSQL + TypeORM
      - Kafka para mensajería
      - Clean Architecture (Hexagonal)
      - Principios SOLID
    `)
    .setVersion('1.0')
    .addTag('Transactions', 'Gestión de transacciones')
    .addServer('http://localhost:3000', 'Servidor de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
} 