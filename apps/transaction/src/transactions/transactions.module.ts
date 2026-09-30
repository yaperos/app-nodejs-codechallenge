import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxRelay } from '../outbox/outbox.relay';
import { Transaction } from './entities/transaction.entity';
import { TransferType } from './entities/transfer-type.entity';
import { TransactionStatusConsumer } from './transaction-status.consumer';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransferType])],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionStatusConsumer, OutboxRelay],
})
export class TransactionsModule {}
