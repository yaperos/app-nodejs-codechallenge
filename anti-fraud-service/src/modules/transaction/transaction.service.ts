import { inject, injectable } from 'inversify';
import { ITransaction, TransactionStatus } from './transaction.interface';
import { EventStreamer } from '../../config/event.streamer.interface';
import { Symbols } from '../../@types';

/**
 * Service used to execute Transaction operations
 */
@injectable()
export class TransactionService {
  /** Event Streamer client instance */
  private readonly _streamer: EventStreamer;

  /**
   * @param {EventStreamer} eventStreamer Event Streamer client
   */
  constructor(@inject(Symbols.EventStreamer) eventStreamer: EventStreamer) {
    this._streamer = eventStreamer;
  }

  /**
   * Run anti fraud validation for Transaction
   * @param {ITransaction} transaction Transaction to validate
   */
  async validate(transaction: ITransaction) {
    try {
      // If Transaction status is not pending, it was already validated
      if (transaction.transactionStatus !== TransactionStatus.PENDING) return;

      // Check if Transaction is valid
      const status = transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;

      // Build updated Transaction object
      const data = { ...transaction, transactionStatus: status };

      // Send update request for Transaction
      await this._streamer.sendMessage(`transaction-${status.toLowerCase()}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error while validating transaction', { error });
      throw (error);
    }
  }
}
