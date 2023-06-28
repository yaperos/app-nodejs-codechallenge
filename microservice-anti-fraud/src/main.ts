import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [app.get(ConfigService).get('KAFKA_HOST')],
      },
      consumer: {
        groupId: app.get(ConfigService).get('KAFKA_CONSUMER_GROUP_ID_ANTI_FRAUD'),
        sessionTimeout: 60000,
        heartbeatInterval: 40000,
        maxWaitTimeInMs: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(app.get(ConfigService).get('MICROSERVICE_ANTI_FRAUD_PORT'));
}
bootstrap();
