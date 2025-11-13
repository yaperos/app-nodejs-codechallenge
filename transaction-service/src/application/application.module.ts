import { Module } from '@nestjs/common';
import { CreateTransactionService } from './services/create-transaction.service';
import { GetTransactionService } from './services/get-transaction.service';
import { UpdateTransactionStatusService } from './services/update-transaction-status.service';
import {
  CREATE_TRANSACTION_USE_CASE,
  GET_TRANSACTION_USE_CASE,
  TRANSACTION_REPOSITORY,
} from '@ports/tokens';
import { PersistenceModule } from '@adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [
    CreateTransactionService,
    GetTransactionService,
    UpdateTransactionStatusService,
    {
      provide: CREATE_TRANSACTION_USE_CASE,
      useExisting: CreateTransactionService,
    },
    {
      provide: GET_TRANSACTION_USE_CASE,
      useExisting: GetTransactionService,
    },
  ],
  exports: [
    CREATE_TRANSACTION_USE_CASE,
    GET_TRANSACTION_USE_CASE,
    UpdateTransactionStatusService,
  ],
})
export class ApplicationModule {}
