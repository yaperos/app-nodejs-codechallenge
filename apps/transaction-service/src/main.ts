import 'config/env/env.config';
import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'modules/logger/logger.service';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';

const logger = new Logger('Transaction Service');

async function bootstrap() {
  const app = await NestFactory.create(TransactionServiceModule, {});

  await app.useGlobalPipes(new ValidationPipe());
  await app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  await app.startAllMicroservices();
  await app.useLogger(app.get(Logger));
  await app.listen(process.env.TRANSACTION_SERVICE_PORT);
  logger.log(`Microservice is listening on:${await app.getUrl()}`);
}
bootstrap();
