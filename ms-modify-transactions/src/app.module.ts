import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
})
export class AppModule {}
