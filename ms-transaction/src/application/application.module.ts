import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import TransactionFactory from './factory/transaction.factory';
import GetAllTransactionsUseCase from './usecases/getAllTransactions.usecase';
import GetTransactionUseCase from './usecases/getTransaction.usecase';
import CreateTransactionUseCase from './usecases/createTransaction.usecase';
import UpdateTransactionUseCase from './usecases/updateTransaction.usecase';
import DeleteTransactionUseCase from './usecases/deleteTransaction.usecase';
import TransactionRepositoryTypeORM from '../infrastructure/adapters/repository/transaction.repository.typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../infrastructure/adapters/repository/entity/transaction.entity';
import TransactionVerifiedUseCase from './usecases/transactionVerified.usecase';

@Module({
  imports: [DomainModule, TypeOrmModule.forFeature([TransactionEntity])],
  providers: [
    TransactionFactory,
    GetAllTransactionsUseCase,
    GetTransactionUseCase,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    TransactionVerifiedUseCase,
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepositoryTypeORM,
    },
  ],
  exports: [
    TransactionFactory,
    GetAllTransactionsUseCase,
    GetTransactionUseCase,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
    TransactionVerifiedUseCase,
  ],
})
export class ApplicationModule {}
