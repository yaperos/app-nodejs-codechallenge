import { Transaction } from "../../domain/entities/transaction";

export class TransactionDTO {
    id?: string;
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;
	status: string;
	createdAt?: string;
	updatedAt?: string;

	constructor(transaction: Transaction) {
		this.id = transaction._id;
		this.accountExternalIdDebit = transaction.accountExternalIdDebit;
		this.accountExternalIdCredit = transaction.accountExternalIdCredit;
		this.tranferTypeId = transaction.tranferTypeId;
		this.value = transaction.value;
		this.status = transaction.status;
		this.createdAt = transaction.createdAt;
		this.updatedAt = transaction.updatedAt;
	}
}