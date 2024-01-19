import { InvalidArgumentError } from '../errors/invalid-argument.error';

export abstract class EnumValueObject<T> {
  readonly value: T;

  constructor(value: T, private readonly validValues: T[]) {
    this.value = value;
    this.checkValueIsValid(value);
  }

  private checkValueIsValid(value: T): void {
    if (!this.validValues.includes(value)) {
      this.throwErrorForInvalidValue(value);
    }
  }

  private throwErrorForInvalidValue(value: T): void {
    throw new InvalidArgumentError(
      `${this.constructor.name} received an invalid value: ${value}`,
    );
  }

  equals(other: EnumValueObject<T>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value === this.value
    );
  }
}
