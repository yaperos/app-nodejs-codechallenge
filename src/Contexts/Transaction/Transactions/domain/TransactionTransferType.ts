import { EnumValueObject } from '../../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export enum TransactionsTransferTypes {
	CREDIT = '1',
	DEBIT = '2'
}

export class TransactionTransferType extends EnumValueObject<TransactionsTransferTypes> {
	constructor(value: TransactionsTransferTypes) {
		super(value, Object.values(TransactionsTransferTypes));
	}

	static fromValue(value: string): TransactionTransferType {
		switch (value) {
			case TransactionsTransferTypes.CREDIT:
				return new TransactionTransferType(TransactionsTransferTypes.CREDIT);
			case TransactionsTransferTypes.DEBIT:
				return new TransactionTransferType(TransactionsTransferTypes.DEBIT);
			default:
				throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
		}
	}

	public isCredit(): boolean {
		return this.value === TransactionsTransferTypes.CREDIT;
	}

	protected throwErrorForInvalidValue(value: TransactionsTransferTypes): void {
		throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
	}
}
