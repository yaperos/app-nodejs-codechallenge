import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { TransactionDBService } from './transaction-db/transaction.db.service';
import { TransactionTypeDBService } from './transaction-db/transaction-type.db.service';
import { TransactionStatusDBService } from './transaction-db/transaction-status.db.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    TransactionDBService,
    TransactionTypeDBService,
    TransactionStatusDBService,
  ],
  exports: [
    TransactionDBService,
    TransactionTypeDBService,
    TransactionStatusDBService,
  ],
})
export class DBModule {}
