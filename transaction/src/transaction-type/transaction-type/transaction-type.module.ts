import { Module } from '@nestjs/common';
import { transactionTypeProviders } from './transaction-type.providers';
import { DatabaseModule } from 'src/database/database.module';
import { TransactionTypeService } from './transaction-type.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...transactionTypeProviders,
    TransactionTypeService
  ],
  exports: [TransactionTypeService]
})
export class TransactionTypeModule {}
