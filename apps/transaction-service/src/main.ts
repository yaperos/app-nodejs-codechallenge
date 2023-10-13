import 'config/env.config';
import { NestFactory } from '@nestjs/core';
import { TransactionServiceModule } from './transaction-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionServiceModule, {});

  await app.startAllMicroservices();
  await app.listen(process.env.TRANSACTION_SERVICE_PORT);
}
bootstrap();
