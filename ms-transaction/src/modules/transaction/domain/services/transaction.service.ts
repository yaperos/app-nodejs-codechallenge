import { Transaction } from '../transaction';
import { TransactionRepository } from '../transaction.repository';
import { TransactionCriteria } from '../transaction-criteria';
import { TransactionNotFoundError } from '../transaction-not-found.error';

export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async findOne(criteria: TransactionCriteria): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneTransactionBy(
      criteria,
    );

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    return transaction;
  }
}
