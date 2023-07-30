import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionType } from '../../db/entities/transaction-type.entity';
import { TransactionStatus } from '../../db/entities/transaction-status.entity';
import { FinancialTransaction } from '../../db/entities/financial-transaction.entity';
import { TypeOrmTransactionAdapter, typerOrmTransactionProvider } from 'src/adapters/_shared/db-transaction.adapter';
import { DbTransactionPort } from 'src/domain/_shared/ports/db-transaction-port';
import { UuidAdapter } from 'src/adapters/_shared/uui.adapter';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TransactionType, TransactionStatus, FinancialTransaction])],
  providers: [
    UuidAdapter,
    typerOrmTransactionProvider,
    { provide: TypeOrmTransactionAdapter, useExisting: DbTransactionPort },
  ],
  exports: [UuidAdapter, TypeOrmTransactionAdapter, TypeOrmModule, DbTransactionPort],
})
export class GlobalModule {}
