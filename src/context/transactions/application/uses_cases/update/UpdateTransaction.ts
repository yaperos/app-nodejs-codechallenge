import { v4 as uuidv4 } from 'uuid';
import Transaction from '@context/transactions/domain/class/Transaction';
import { ITransactionRepository } from '@context/transactions/domain/contracts/ITransactionRepository';
import { TransactionStatusType } from '@context/transactions/domain/enums/TransactionStatusType';

export class UpdateTransaction {
  private repository: ITransactionRepository;

  constructor(repository: ITransactionRepository) {
    this.repository = repository;
  }

  async run(transaction: Transaction): Promise<Transaction> {
    let transactionType = TransactionStatusType.UPDATED;
    if (transaction.status === TransactionStatusType.REJECTED) {
      const transactionExternalId = uuidv4();
      transaction.id = transactionExternalId;
      transaction.transactionExternalId = transactionExternalId;
      transaction.createdAt = new Date();
      transactionType = TransactionStatusType.REJECTED;
    }
    transaction.transactionType = transactionType;
    transaction.updatedAt = new Date();

    return this.repository.updateTransaction(transaction);
  }
}
