export enum TransactionTypes {
    INTERNAL_TRANSACTION,
    EXTERNAL_TRANSACTION
}

export enum TransactionStatuses {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
}

export class TransactionDto {
    readonly _id: string;
	readonly transactionExternalId: string;
	readonly accountExternalIdDebit: string;
	readonly accountExternalIdCredit: string;
	readonly transferTypeId: TransactionTypes;
	readonly value: number;
	readonly transactionType: { name: TransactionTypes };
	readonly transactionStatus: { name: TransactionStatuses };
    readonly createdAt: Date;
    readonly updatedAt: Date;
}