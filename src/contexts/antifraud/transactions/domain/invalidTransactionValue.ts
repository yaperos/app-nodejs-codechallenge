import { NumberValueObject } from '../../../shared/domain/valueObject/numberValueObject';

export class InvalidTransactionValue extends NumberValueObject {
	constructor() {
		super(1000);
	}
}
