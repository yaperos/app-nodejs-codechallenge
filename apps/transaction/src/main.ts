import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  await app.listen(process.env.TRANSACTION_SERVICE_PORT ?? 3001);
}
bootstrap();
