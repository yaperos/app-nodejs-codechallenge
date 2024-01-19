import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { ValueObject } from 'src/modules/shared/domain/value-object/value-object';

export class TransactionAmount extends ValueObject<number> {
  constructor(value: number) {
    super(value);

    this.ensureIsValid(value);
  }

  private ensureIsValid(value: number): void {
    if (value <= 0) {
      throw new InvalidArgumentError(`<${value}> is not a valid amount`);
    }
  }
}
