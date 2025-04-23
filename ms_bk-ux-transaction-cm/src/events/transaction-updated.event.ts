import { STATUS_TRANSACTION } from 'src/config/constants';

export class TransactionStatusUpdatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly status:
      | STATUS_TRANSACTION.PENDING
      | STATUS_TRANSACTION.APPROVED
      | STATUS_TRANSACTION.REJECTED,
  ) {}
}
