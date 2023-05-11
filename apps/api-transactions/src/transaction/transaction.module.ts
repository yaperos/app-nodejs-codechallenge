import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
