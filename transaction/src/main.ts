import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);
  await app.listen(3000);
}
bootstrap();
