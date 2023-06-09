import { EnumValueObject } from '../../../shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../../shared/domain/value-object/InvalidArgumentError';
import { FinancialTransactionTypeEnum } from './transfer-type.enum';

export class FinancialTransactionType extends EnumValueObject<FinancialTransactionTypeEnum> {
  constructor(value: FinancialTransactionTypeEnum) {
    super(value, Object.values(FinancialTransactionTypeEnum));
  }

  static fromValue(value: string): FinancialTransactionType {
    for (const transferTypeValue of Object.values(
      FinancialTransactionTypeEnum,
    )) {
      if (value === transferTypeValue.toString()) {
        return new FinancialTransactionType(transferTypeValue);
      }
    }

    throw new InvalidArgumentError(`The transfer type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(
    value: FinancialTransactionTypeEnum,
  ): void {
    throw new InvalidArgumentError(`The transfer type ${value} is invalid`);
  }
}
