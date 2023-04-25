import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TransactionServiceModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

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


  await app.listen(3000);
}
bootstrap();
