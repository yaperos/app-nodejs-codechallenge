import { Guard, Result, ValueObject } from 'clean-common-lib';

interface TransactionValueProps {
  value: number;
}

export class TransactionValue extends ValueObject<TransactionValueProps> {
  public static minAmount = 1;

  private constructor(props: TransactionValueProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  public static create(props: TransactionValueProps): Result<TransactionValue> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'value');

    if (nullGuardResult.isFailure) {
      return Result.fail<TransactionValue>(nullGuardResult.getErrorValue());
    }

    const minAmountGuardResult = Guard.greaterThan(this.minAmount, props.value);

    if (minAmountGuardResult.isFailure) {
      return Result.fail<TransactionValue>(
        minAmountGuardResult.getErrorValue()
      );
    }

    return Result.ok<TransactionValue>(new TransactionValue(props));
  }
}
