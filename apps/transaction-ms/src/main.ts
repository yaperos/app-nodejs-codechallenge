import { NestFactory } from '@nestjs/core';
import { TransactionMsModule } from './transaction-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionMsModule);
  await app.listen(3000);
}
bootstrap();
