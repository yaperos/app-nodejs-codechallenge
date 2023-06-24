import { TransactionStatus } from 'src/models/enums';

export class UpdateTransactionCommand {
  constructor(
    public readonly transctionId: number,
    public readonly transactionStatus: TransactionStatus,
  ) {}
}
