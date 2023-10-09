import { EnumValueObject } from '../../../shared/domain/valueObject/enumValueObject';
import { InvalidArgumentError } from '../../../shared/domain/valueObject/invalidArgumentError';

export enum TransactionTypes {
	TRANSFERS = 'transfers'
}

export class TransactionType extends EnumValueObject<TransactionTypes> {
	constructor(value: TransactionTypes) {
		super(value, Object.values(TransactionTypes));
	}

	static fromValue(value: string): TransactionType {
		switch (value) {
			case TransactionTypes.TRANSFERS:
				return new TransactionType(TransactionTypes.TRANSFERS);
			default:
				throw new InvalidArgumentError(`The transaction type ${value} is invalid`);
		}
	}

	protected throwErrorForInvalidValue(value: TransactionTypes): void {
		throw new InvalidArgumentError(`The transaction type ${value} is invalid`);
	}
}
