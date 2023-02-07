import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { EventModule } from '../shared/event/EventModule';

@Module({
  imports: [EventModule],

  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
