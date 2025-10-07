import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [TransactionModule],
})
export class AppModule {}
