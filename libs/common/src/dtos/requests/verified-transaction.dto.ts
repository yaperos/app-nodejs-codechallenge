import { TransactionStatusEnum } from 'apps/api-gateway/src/transactions/enums/transaction.enum';

export class VerifiedTransactionDto {
  readonly uuid: string;
  readonly status: TransactionStatusEnum;
}
