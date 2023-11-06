import { TransactionStatus } from 'src/domain/models';

export class UpdateTransactionStatusCommand {
  constructor(
    public readonly transactionId: string,
    public readonly status: TransactionStatus,
  ) {}
}
