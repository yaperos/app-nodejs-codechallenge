import { TransactionId } from 'src/anti-fraud/domain/TransactionId';
import { TransactionStatus } from 'src/anti-fraud/domain/TransactionStatus';
import { TransactionValue } from 'src/anti-fraud/domain/TransactionValue';

export interface TransactionPrimitives {
  uuid: string;
  transactionStatus: { name: string };
  value: number;
}
export class Transaction {
  constructor(
    private uuid: TransactionId,
    private transactionStatus: TransactionStatus,
    private value: TransactionValue,
  ) {}

  verifyFraud() {
    if (this.value.isValid()) {
      this.transactionStatus.approveTransaction();
    } else {
      this.transactionStatus.rejectTransaction();
    }
  }
  toPrimitives(): TransactionPrimitives {
    return {
      uuid: this.uuid.value,
      transactionStatus: { name: this.transactionStatus.name },
      value: this.value.value,
    };
  }
}
