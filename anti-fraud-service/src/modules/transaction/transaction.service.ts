import { inject, injectable } from 'inversify';
import { ITransaction, TransactionStatus } from './transaction.interface';
import { EventStreamer } from '../../config/event.streamer.interface';
import { Symbols } from '../../@types';

@injectable()
export class TransactionService {
  private readonly _streamer: EventStreamer;

  constructor(@inject(Symbols.EventStreamer) eventStreamer: EventStreamer) {
    this._streamer = eventStreamer;
  }

  async validate(transaction: ITransaction) {
    try {
      if (transaction.transactionStatus !== TransactionStatus.PENDING) return;

      const status = transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;

      const data = { ...transaction, transactionStatus: status };

      await this._streamer.sendMessage(`transaction-${status.toLowerCase()}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error while validating transaction', { error });
      throw (error);
    }
  }
}
