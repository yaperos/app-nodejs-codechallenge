import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cfg = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: cfg.get('KAFKA_CLIENT_ID', 'trx-api'),
        brokers: (cfg.get<string>('KAFKA_BROKERS') || '').split(','),
      },
      consumer: {
        groupId: cfg.get('KAFKA_GROUP_ID', 'trx-api-group'),
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
