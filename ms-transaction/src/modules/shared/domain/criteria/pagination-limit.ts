import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { IntValueObject } from '../value-object/int-value-object';

export class PaginationLimit extends IntValueObject {
  static readonly DEFAULT_VALUE = 10;
  static readonly MIN_VALUE = 1;

  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  static fromDefault(
    value: number = PaginationLimit.DEFAULT_VALUE,
  ): PaginationLimit {
    return new this(value);
  }

  private ensureIsValid(value: number): void {
    if (value < PaginationLimit.MIN_VALUE) {
      throw new InvalidArgumentError(`<${value}> is not a valid limit`);
    }
  }
}
