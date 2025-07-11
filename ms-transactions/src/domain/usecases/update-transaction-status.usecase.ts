import { TransactionStatus } from '../enums/transaction.enums';

export interface UpdateTransactionStatusUseCase {
  execute(
    transactionExternalId: string,
    status: TransactionStatus,
  ): Promise<void>;
}
