import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cfg = app.get(ConfigService)

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: cfg.get('KAFKA_CLIENT_ID', 'anti-fraud'),
        brokers: (cfg.get<string>('KAFKA_BROKERS') || '').split(','),
      },
      consumer: {
        groupId: cfg.get('KAFKA_GROUP_ID', 'anti-fraud-group'),
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
