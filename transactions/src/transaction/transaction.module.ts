import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionHttpController } from './transaction.http.controller';
import { CreateTransferRepository } from './repositories/create-transaction-repository';
import { LoggerService } from '../shared/logger/logger.service';

@Module({
  imports: [],
  controllers: [TransactionController, TransactionHttpController],
  providers: [
    TransactionService,
    TransactionRepository,
    CreateTransferRepository,
  ],
})
export class TransactionModule {}
