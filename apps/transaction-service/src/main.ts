import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger, } from '@nestjs/common';
import { TransactionServiceModule } from './transaction-service.module';

const logger = new Logger('transaction-service');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    TransactionServiceModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9091'],
      },
      consumer: {
        groupId: 'transaction-consumer' 
      },
    }
  });
  await app.listen();
  logger.log('Transaction Microservice is running');
}
bootstrap();
