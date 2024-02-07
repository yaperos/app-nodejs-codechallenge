import { TransactionRepository } from 'src/shared/domain/transaction.repository';
import { TransactionStatusUpdatetDto as TransactionAntiFraudetDto } from './transaction.update.dto';
import { TransactionNotFoundError } from 'src/shared/domain/errors/transaction-not-exist.error';

export class TransactionAntiFraudeUpdate {
  constructor(private readonly repository: TransactionRepository) {}

  async handle(input: TransactionAntiFraudetDto) {
    const transaction = await this.repository.getById(input.id);

    if (!transaction) throw new TransactionNotFoundError();

    input.rejected ? transaction.setRejected() : transaction.setApproved();
    await this.repository.update(transaction);

    return transaction;
  }
}
