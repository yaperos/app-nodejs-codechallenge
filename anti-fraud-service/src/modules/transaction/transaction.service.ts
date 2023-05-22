import { ITransaction, TransactionStatus } from './transaction.interface';
import { EventStreamer } from '../../config/event.streamer.interface';

export class TransactionService {
  private readonly streamer: EventStreamer;

  constructor(streamerClient: EventStreamer) {
    this.streamer = streamerClient;
  }

  async validate(transaction: ITransaction) {
    try {
      if (transaction.transactionStatus !== TransactionStatus.PENDING) return;

      const status = transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;

      const data = { ...transaction, transactionStatus: status };

      await this.streamer.sendMessage(`transaction-${status.toLowerCase()}`, JSON.stringify(data));
    } catch (error) {
      console.error(error);
      throw new Error('Error while getting transaction');
    }
  }
}
