import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { StringValueObject } from '../value-object/string-value-object';

export class OrderBy extends StringValueObject {
  static readonly MIN_LENGTH = 2;
  static readonly VALID_REGEX = /^[\w]+$/;

  constructor(value: string) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (value.length < OrderBy.MIN_LENGTH || !OrderBy.VALID_REGEX.test(value)) {
      throw new InvalidArgumentError(`<${value}> is not a valid orderBy`);
    }
  }
}
