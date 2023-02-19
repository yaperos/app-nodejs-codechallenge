import { EnumValueObject } from '../../../Shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

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
				throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
		}
	}

	protected throwErrorForInvalidValue(value: TransactionTypes): void {
		throw new InvalidArgumentError(`The filter operator ${value} is invalid`);
	}
}
