import { Module } from '@nestjs/common';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, TransactionHistoryModule],
  providers: [],
})
export class AppModule {}
