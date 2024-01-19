import { InvalidArgumentError } from './errors/invalid-argument.error';
import { IntValueObject } from './value-object/int-value-object';

export class PaginatedCollectionTotal extends IntValueObject {
  static readonly MIN_VALUE = 0;

  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: number): void {
    if (value < PaginatedCollectionTotal.MIN_VALUE) {
      throw new InvalidArgumentError(`<${value}> is not a valid total`);
    }
  }
}
