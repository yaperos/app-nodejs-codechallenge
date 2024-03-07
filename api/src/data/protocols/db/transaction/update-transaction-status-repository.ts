import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';

export interface IUpdateTransactionStatusRepository {
	updateStatus(
		status: TransactionStatusEnum,
		transactionExternalId: string
	): Promise<void>;
}
