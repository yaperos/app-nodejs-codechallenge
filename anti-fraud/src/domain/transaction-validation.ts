import { ITransaction } from '../interfaces/transaction.interface';

export enum TransactionStatus {
  approved = 'approved',
  rejected = 'rejected',
}

const MAX_VALID_TRANSACTION_AMOUNT = 1000;

export class TransactionValidation {
  public static isValidTransaction(transactionAmount: number): string {
    if (transactionAmount <= MAX_VALID_TRANSACTION_AMOUNT) {
      return TransactionStatus.approved;
    }
    return TransactionStatus.rejected;
  }

  public static validateTransaction(payload: string) {
    const transaction: ITransaction = JSON.parse(payload);
    const status = this.isValidTransaction(transaction.value);

    const response = {
      id: transaction.id,
      value: transaction.value,
      status,
    };

    return JSON.stringify(response);
  }
}
