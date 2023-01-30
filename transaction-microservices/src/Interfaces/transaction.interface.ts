
export enum StatusInterface {
	PENDING = 'pending',
	APPROVED = 'approved',
	REJECTED = 'rejected'
}

export interface TransactionInterface {
	id: string
	accountExternalIdDebit: string,
	accountExternalIdCredit: string,
	tranferTypeId: number,
	value: number,
	transactionExternalId: string,
	status: string,
	createdAt: string,
	updatedAt: string,
}

export type TransactionCreateInterface = Omit<
	TransactionInterface,
	'id' | 'status' | 'createdAt' | 'updatedAt' | 'transactionExternalId'
>
