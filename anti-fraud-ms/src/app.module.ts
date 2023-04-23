import { TransactionModule } from './../../transaction-api-ms/src/transaction/transaction.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
