import { TransactionStatusEnum } from 'shared/enum/transaction-status-enum';

type TransactionEntity = {
	id?: number;
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	transactionExternalId?: string;
	transferTypeId: number;
	status: TransactionStatusEnum;
	value: number;
};

export { TransactionEntity };
