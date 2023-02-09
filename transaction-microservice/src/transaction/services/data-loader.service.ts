import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { TransactionStatus } from 'src/database/entities/transaction-status.entity';
import { TransactionType } from 'src/database/entities/transaction.type.entity';
import { IDataloaders } from 'src/interfaces/data-loaders.interface';
import { TransactionService } from './transaction.service';

@Injectable()
export class DataLoaderService {
  constructor(private readonly transactionService: TransactionService) {}

  getLoaders(): IDataloaders {
    const transactionStatusLoader = this._createTransactionStatusLoader();
    const transactionTypeLoader = this._createTransactionTypeLoader();
    return {
      transactionStatusLoader,
      transactionTypeLoader,
    };
  }

  private _createTransactionStatusLoader() {
    return new DataLoader<number, TransactionStatus>(
      async (keys: readonly number[]) =>
        await this.transactionService.getTransactionStatusFromBatch(
          keys as number[],
        ),
    );
  }

  private _createTransactionTypeLoader() {
    return new DataLoader<number, TransactionType>(
      async (keys: readonly number[]) =>
        await this.transactionService.getTransactionTypeFromBatch(
          keys as number[],
        ),
    );
  }
}
