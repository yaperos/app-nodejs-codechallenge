import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { StringValueObject } from '../value-object/string-value-object';

export class FilterField extends StringValueObject {
  static readonly MIN_LENGTH = 2;

  constructor(value: string) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (value.length < FilterField.MIN_LENGTH) {
      throw new InvalidArgumentError(`<${value}> is not a valid filterField`);
    }
  }
}
