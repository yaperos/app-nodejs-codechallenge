import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';
import { TransactionsTypesModule } from 'src/modules/transactions-types/transactions-types.module';

@Module({
  imports: [CommonModule, TransactionsModule, TransactionsTypesModule],
})
export class AppModule {}
