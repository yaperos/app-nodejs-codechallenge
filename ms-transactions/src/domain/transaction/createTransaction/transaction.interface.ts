import {
  TransactionInterface,
  TransactionInterfaceRequest,
} from './transaction.model';

export interface TransactionControllerInterface {
  createTransaction(
    data: TransactionInterfaceRequest,
  ): Promise<TransactionInterface>;

  updateTransactionAccepted(trx: TransactionInterface): Promise<void>;

  updateTransactionRejected(trx: TransactionInterface): Promise<void>;
}

export interface TransactionServiceInterface {
  createTransaction(trx: TransactionInterface): Promise<void>;
  updateTransaction(trx: TransactionInterface): Promise<void>;
}
