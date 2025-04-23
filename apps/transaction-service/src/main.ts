import { KAFKA_TOPICS } from '@app/shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const swaggerConfig = new DocumentBuilder()
    .setTitle('Transaction Service API')
    .setDescription('API para el servicio de transacciones')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());

  // Configure Kafka microservice
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'transaction-service',
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-consumer',
        allowAutoTopicCreation: true,
      },
      subscribeToResponseOf: [
        KAFKA_TOPICS.TRANSACTION_STATUS_APPROVED,
        KAFKA_TOPICS.TRANSACTION_STATUS_REJECTED,
      ],
    },
  });


  await app.startAllMicroservices();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Transaction service is running on port ${port}`);
}

bootstrap();
