import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../core/entity/transaction.entity';
import { TransactionTypeEntity } from '../../core/entity/transaction-type.entity';
import { TransactionStateEntity } from '../../core/entity/transaction-state.entity';
import { SaveTransactionUseCase } from '../../core/use-case/transaction/save-transaction.usecase';
import { TransactionService } from '../service/transaction.service';
import { GetTransactionUseCase } from '../../core/use-case/transaction/get-transaction.usecase';
import { DataLoaderService } from '../service/data-loader.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionTypeEntity,
      TransactionStateEntity
    ])
  ],
  providers: [
    SaveTransactionUseCase,
    GetTransactionUseCase,
    { provide: 'TransactionRepository', useClass: TransactionService },
    DataLoaderService
  ],
  exports: [
    SaveTransactionUseCase,
    GetTransactionUseCase,
    DataLoaderService
  ]
})
export class TransactionProxyModule { }