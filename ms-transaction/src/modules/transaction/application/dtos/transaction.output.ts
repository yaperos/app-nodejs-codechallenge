import { Transaction } from 'src/modules/transaction/domain/transaction';

interface TransferType {
  id: string;
  name: string;
}

export interface ITransactionOutput {
  id: string;
  transferType: TransferType;
  validationStatus: string;
  amount: number;
  createdAt: string;
}

export class TransactionOutput implements ITransactionOutput {
  id: string;
  transferType: TransferType;
  validationStatus: string;
  amount: number;
  createdAt: string;

  static fromTransaction(transaction: Transaction): TransactionOutput {
    return {
      id: transaction.getId(),
      transferType: {
        id: transaction.getTransferType(),
        name: transaction.getTransferTypeName(),
      },
      validationStatus: transaction.getValidationStatus(),
      amount: transaction.getAmount(),
      createdAt: transaction.getCreatedAt().toISOString(),
    };
  }
}
