import { NestFactory } from '@nestjs/core';
import { AntifraudServiceModule } from './antifraud-service.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AntifraudServiceModule);

  const config = app.get(ConfigService);

  const kafkaBrokers = config.get('KAFKA_BROKERS').split(',');
  const groupId = config.get('KAFKA_GROUP_ID');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaBrokers
      },
      consumer: {
        groupId: groupId
      }
    }
  })

  app.startAllMicroservices();
}
bootstrap();
