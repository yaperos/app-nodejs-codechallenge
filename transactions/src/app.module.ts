import { Module } from '@nestjs/common';
import TransactionModule from './transactions/transactions.module';

@Module({
  imports: [TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
