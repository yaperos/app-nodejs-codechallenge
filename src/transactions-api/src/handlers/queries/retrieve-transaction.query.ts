import { TransactionStatus, TransactionType } from 'src/models/enums';

export class RetrieveTransactionQuery {
  constructor(
    public readonly transferExternalId: string,
    public readonly transactionType: TransactionType,
    public readonly transactionStatus: TransactionStatus,
    public readonly value: number,
    public readonly createdAt: Date,
  ) {}
}
