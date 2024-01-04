import { Transaction } from '../interfaz/transaction.interfaz';
import { TransactionStatusEnum } from '../enums/transaction.status.enum';

export const updatedTransactionEvent = (transactionUpdated: Transaction) => {
  return JSON.stringify({
    id: transactionUpdated.id,
    transactionStatus:
      transactionUpdated.value > 1000
        ? TransactionStatusEnum.REJECTED
        : TransactionStatusEnum.APPROVED,
  });
};
