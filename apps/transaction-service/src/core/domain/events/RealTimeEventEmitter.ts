import { TransactionOutput } from '../models';

export interface RealTimeEventEmitter {
  transactionUpdatedEvent: (transaction: TransactionOutput) => void;
}
