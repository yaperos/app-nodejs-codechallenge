import { TransactionId } from 'src/anti-fraud/domain/TransactionId';
import { TransactionStatus } from 'src/anti-fraud/domain/TransactionStatus';
import { TransactionValue } from 'src/anti-fraud/domain/TransactionValue';

export class VerifyTransactionValueCommand {
  constructor(
    public id: TransactionId,
    public transactionStatus: TransactionStatus,
    public value: TransactionValue,
  ) {}
}
