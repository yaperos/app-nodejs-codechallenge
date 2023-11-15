import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionsEntity } from './entities/transaction.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [TypeOrmModule.forFeature([TransactionsEntity])],
  exports: [TransactionService, TypeOrmModule],
})
export class TransactionModule {}
