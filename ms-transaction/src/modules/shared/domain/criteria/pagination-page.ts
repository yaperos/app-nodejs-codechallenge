import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { IntValueObject } from '../value-object/int-value-object';

export class PaginationPage extends IntValueObject {
  static readonly DEFAULT_VALUE = 1;
  static readonly MIN_VALUE = 1;

  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  static fromDefault(
    value: number = PaginationPage.DEFAULT_VALUE,
  ): PaginationPage {
    return new this(value);
  }

  private ensureIsValid(value: number): void {
    if (value < PaginationPage.MIN_VALUE) {
      throw new InvalidArgumentError(`<${value}> is not a valid page`);
    }
  }
}
