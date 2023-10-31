import { RealTimeEventEmitter, TransactionOutput } from '../../../core/domain';

export class SocketRealTimeEventEmitter implements RealTimeEventEmitter {
  transactionUpdatedEvent(transaction: TransactionOutput): void {
    console.log(transaction);
  }
}
