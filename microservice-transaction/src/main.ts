import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [app.get(ConfigService).get('KAFKA_HOST')],
      },
      consumer: {
        groupId: app.get(ConfigService).get('KAFKA_CONSUMER_GROUP_ID_ANTI_FRAUD_VERIFIED'),
        sessionTimeout: 60000,
        heartbeatInterval: 40000,
        maxWaitTimeInMs: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(app.get(ConfigService).get('MICROSERVICE_TRANSACTION_PORT'));
}
bootstrap();
