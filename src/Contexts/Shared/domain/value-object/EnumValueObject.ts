import { Primitives, ValueObject } from './ValueObject';

export abstract class EnumValueObject<T extends Primitives> extends ValueObject<T> {
	readonly value: T;

	constructor(value: T, public readonly validValues: T[]) {
		super(value);
		this.value = value;
		this.checkValueIsValid(value);
	}

	protected abstract throwErrorForInvalidValue(value: T): void;

	public checkValueIsValid(value: T): void {
		if (!this.validValues.includes(value)) {
			this.throwErrorForInvalidValue(value);
		}
	}
}
