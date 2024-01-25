import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransactionsService } from './services/transactions.service';
import { TransferTypeService } from './services/transferType.service';
import { TransferType } from './entities/transaction-type.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransferType])],
  providers: [TransactionsService, TransferTypeService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
