import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'anti-fraud-service',
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
        connectionTimeout: 3000,
        authenticationTimeout: 1000,
      },
      consumer: {
        groupId: 'anti-fraud-consumer',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        retry: {
          retries: 10,
          initialRetryTime: 1000,
          maxRetryTime: 30000,
        },
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
