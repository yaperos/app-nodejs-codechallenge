import { NestFactory } from '@nestjs/core';
import { ApiTransactionsModule } from './api-transactions.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiTransactionsModule);
  await app.listen(3000);
}
bootstrap();
