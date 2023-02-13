import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger, } from '@nestjs/common';
import { TransactionServiceModule } from './transaction-service.module';
import {
  TRANSACTION_CONSUMER,
  configOptions,
} from '../../../@shared';
const logger = new Logger('transaction-service');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    TransactionServiceModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: configOptions().kafka.brokers,
      },
      consumer: {
        groupId: TRANSACTION_CONSUMER,
      },
    }
  });
  await app.listen();
  logger.log('Transaction Microservice is running');
}
bootstrap();
