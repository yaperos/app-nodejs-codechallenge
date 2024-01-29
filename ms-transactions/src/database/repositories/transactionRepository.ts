import { Transaction } from '../../models/Transaction';
import { TransactionEntity } from '../entities/TransactionEntity';

export const createTransactionRepository = async (transaction: Transaction) => {
  try {
    return await TransactionEntity.create({
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      value: transaction.value
    });
  } catch (e) {
    console.log(e);
  }
};
