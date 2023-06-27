import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { TransactionStatus } from 'src/entities/transaction-status.entity';
import { TransactionType } from 'src/entities/transaction.type.entity';
import { IDataloaders } from 'src/interfaces/data-loaders.interface';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class DataLoaderService {
  constructor(private transactionService: TransactionService) {}
  getAllLoaders(): IDataloaders {
    return {
      transactionStatusLoader: new DataLoader<number, TransactionStatus>(
        async (keys: readonly number[]) =>
          await this.transactionService.getTransactionStatusFromBatch(
            keys as number[],
          ),
      ),
      transactionTypeLoader: new DataLoader<number, TransactionType>(
        async (keys: readonly number[]) =>
          await this.transactionService.getTransactionTypeFromBatch(
            keys as number[],
          ),
      ),
    };
  }
}
