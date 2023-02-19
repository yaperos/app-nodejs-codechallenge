import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { TransactionAccountExternalIdCredit } from './TransactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from './TransactionAccountExternalIdDebit';
import { TransactionId } from './TransactionId';
import { TransactionStatus } from './TransactionStatus';
import { TransactionTransferType } from './TransactionTransferType';
import { TransactionType } from './TransactionType';
import { TransactionValue } from './TransactionValue';

export class Transaction extends AggregateRoot {
	readonly id: TransactionId;
	readonly accountExternalIdCredit: TransactionAccountExternalIdCredit;
	readonly accountExternalIdDebit: TransactionAccountExternalIdDebit;
	readonly status: TransactionStatus;
	readonly transferType: TransactionTransferType;
	readonly type: TransactionType;
	readonly value: TransactionValue;

	constructor(
		id: TransactionId,
		accountExternalIdCredit: TransactionAccountExternalIdCredit,
		accountExternalIdDebit: TransactionAccountExternalIdDebit,
		status: TransactionStatus,
		transferType: TransactionTransferType,
		type: TransactionType,
		value: TransactionValue
	) {
		super();
		this.id = id;
		this.accountExternalIdCredit = accountExternalIdCredit;
		this.accountExternalIdDebit = accountExternalIdDebit;
		this.status = status;
		this.transferType = transferType;
		this.type = type;
		this.value = value;
	}

	static create(
		id: TransactionId,
		accountExternalIdCredit: TransactionAccountExternalIdCredit,
		accountExternalIdDebit: TransactionAccountExternalIdDebit,
		status: TransactionStatus,
		transferType: TransactionTransferType,
		type: TransactionType,
		value: TransactionValue
	): Transaction {
		const transaction = new Transaction(
			id,
			accountExternalIdCredit,
			accountExternalIdDebit,
			status,
			transferType,
			type,
			value
		);

		return transaction;
	}

	static fromPrimitives(plainData: {
		id: string;
		accountExternalIdDebit: string;
		accountExternalIdCredit: string;
		status: string;
		transferTypeId: number;
		type: string;
		value: number;
	}): Transaction {
		return new Transaction(
			new TransactionId(plainData.id),
			new TransactionAccountExternalIdCredit(plainData.accountExternalIdDebit),
			new TransactionAccountExternalIdDebit(plainData.accountExternalIdDebit),
			TransactionStatus.fromValue(plainData.status),
			TransactionTransferType.fromValue(String(plainData.transferTypeId)),
			TransactionType.fromValue(plainData.type),
			new TransactionValue(plainData.value)
		);
	}

	toPrimitives(): any {
		return {
			id: this.id.value,
			accountExternalIdDebit: this.accountExternalIdDebit.value,
			accountExternalIdCredit: this.accountExternalIdCredit.value,
			status: this.status.value,
			tranferTypeId: this.transferType.value,
			type: this.type.value,
			value: this.value.value
		};
	}
}
