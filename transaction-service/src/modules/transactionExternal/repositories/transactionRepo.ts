import { TransactionExternal } from '../domain';

export interface ITransactionRepo {
  exists(transactionId: string): Promise<boolean> | boolean;
  save(transaction: TransactionExternal): Promise<void>;
  getTransactionById(
    transactionId: string
  ): Promise<TransactionExternal> | TransactionExternal;
  update(transaction: TransactionExternal): Promise<void>;
}
