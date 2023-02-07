import { Module } from '@nestjs/common';
import { PrismaService } from '../../core/infrastructure/services';
import { RegisterTransactionUseCase } from './application/create';
import { TransactionRepository } from './domain/repositories';
import { TransactionController } from './infrastructure/controllers/transaction-controller/transaction-controller';
import { PrismaTransactionRepository } from './infrastructure/repositories';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    RegisterTransactionUseCase,
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
  ],
})
export class TransactionsModule {}
