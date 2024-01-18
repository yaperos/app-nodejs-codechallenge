import { v4 as uuidv4 } from 'uuid';
import Transaction from '@context/transactions/domain/class/Transaction';
import { ITransactionRepository } from '@context/transactions/domain/contracts/ITransactionRepository';
import { TransactionStatusType } from '@context/transactions/domain/enums/TransactionStatusType';

export class CreateTransaction {
  private repository: ITransactionRepository;

  constructor(repository: ITransactionRepository) {
    this.repository = repository;
  }

  async run(transaction: Transaction): Promise<string> {
    const transactionExternalId = uuidv4();

    transaction.id = transactionExternalId;
    transaction.transactionExternalId = transactionExternalId;
    transaction.transactionType = TransactionStatusType.CREATED;
    transaction.createdAt = new Date();
    delete transaction.updatedAt;

    return this.repository.createTransaction(transaction);
  }
}
