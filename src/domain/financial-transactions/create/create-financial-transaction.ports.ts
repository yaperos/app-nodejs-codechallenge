import {
  CreateTransactionData,
  FinancialTransaction,
  TransactionStatusId,
  TransactionTypeId,
} from './create-financial-transaction.entities';

export abstract class FinancialTransactionPort {
  abstract createFinancialTransaction(transaction: CreateTransactionData): Promise<FinancialTransaction>;
}

export abstract class TransactionStatusPort {
  abstract getTransactionStatusByName(name: string): Promise<TransactionStatusId>;
}

export abstract class TransactionTypePort {
  abstract getTransactionTypeByName(name: string): Promise<TransactionTypeId>;
}
