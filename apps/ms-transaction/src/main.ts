import { NestFactory } from '@nestjs/core';
import { MsTransactionModule } from './ms-transaction.module';

async function bootstrap() {
  const app = await NestFactory.create(MsTransactionModule);
  await app.listen(3000);
}
bootstrap();
