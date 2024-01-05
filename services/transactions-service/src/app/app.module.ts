import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';

@Module({
  imports: [CommonModule, TransactionsModule],
})
export class AppModule {}
