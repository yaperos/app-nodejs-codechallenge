import { Logger } from '../common/types';
import {
  TransactionProxy,
  TransactionStatus,
} from '../proxies/transaction.proxy';

export class TransactionValidateCommand {
  constructor(
    private readonly transactionProxy: TransactionProxy,
    private readonly logger: Logger,
  ) {}

  async handle(id: string) {
    this.logger.debug(`Trying to validate transaction: ${id}`);
    const transaction = await this.transactionProxy.findById(id);

    if (!transaction) {
      throw new Error(`Invalid transaction has been supplied: ${id}`);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      this.logger.debug(`Transaction has been previously updated: ${id}`);
    }

    const newStatus =
      transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;

    this.logger.debug(`Trying to update transaction: ${id} to ${newStatus}`);
    await this.transactionProxy.updateStatus(id, newStatus);
  }
}
