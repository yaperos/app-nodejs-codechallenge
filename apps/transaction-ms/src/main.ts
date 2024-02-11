import { NestFactory } from '@nestjs/core';
import { TransactionMsModule } from './transaction-ms.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  TRANSACTION_CONSUMER_CLIENT,
  TRANSACTION_SERVER,
} from 'utils/utils/constants-global';

async function bootstrap() {
  const app = await NestFactory.create(TransactionMsModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('TRANSACTION_MS_PORT');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get<string>('KAFKA_BROKER_URL')],
        clientId: TRANSACTION_SERVER,
      },
      consumer: {
        groupId: TRANSACTION_CONSUMER_CLIENT,
        sessionTimeout: 30000,
        retry: { retries: 30 },
        allowAutoTopicCreation: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await microservice.listen();
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
