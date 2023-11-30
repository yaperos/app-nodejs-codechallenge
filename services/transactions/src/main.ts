import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransactionService } from './transaction/transaction.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const transactionService = app.get(TransactionService); // Obtén una instancia del servicio

  await transactionService.subscribeValidatedTransaction();
  await app.listen(3001);
}
bootstrap();
