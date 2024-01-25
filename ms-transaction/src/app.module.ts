import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  controllers: [AppController],
  imports: [TransactionsModule],
})
export class AppModule {}
