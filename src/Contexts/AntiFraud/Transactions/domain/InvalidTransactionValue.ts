import { NumberValueObject } from '../../../Shared/domain/value-object/NumberValueObject';

export class InvalidTransactionValue extends NumberValueObject {
	constructor() {
		super(1000);
	}
}
