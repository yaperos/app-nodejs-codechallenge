export interface NewTransactionDto {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;
}