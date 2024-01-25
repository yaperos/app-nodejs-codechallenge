import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransferType } from './entities/transaction-type.entity';
import { Transaction } from './entities/transaction.entity';
import { KafkaService } from './services/kafka.service';
import { TransactionsService } from './services/transactions.service';
import { TransferTypeService } from './services/transferType.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransferType])],
  providers: [KafkaService, TransactionsService, TransferTypeService],
})
export class TransactionsModule {}
