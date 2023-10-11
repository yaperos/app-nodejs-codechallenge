import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  await app.listen(3000);
}
bootstrap();
