import { EnumValueObject } from '../../../shared/domain/value-object/EnumValueObject';
import { InvalidArgumentError } from '../../../shared/domain/value-object/InvalidArgumentError';
import { FinancialTransactionStatusEnum } from './financial-transaction-status.enum';

export class FinancialTransactionStatus extends EnumValueObject<FinancialTransactionStatusEnum> {
  constructor(value: FinancialTransactionStatusEnum) {
    super(value, Object.values(FinancialTransactionStatusEnum));
  }

  static fromValue(value: string): FinancialTransactionStatus {
    for (const transferTypeStatus of Object.values(
      FinancialTransactionStatusEnum,
    )) {
      if (value === transferTypeStatus.toString()) {
        return new FinancialTransactionStatus(transferTypeStatus);
      }
    }

    throw new InvalidArgumentError(`The transfer type ${value} is invalid`);
  }

  protected throwErrorForInvalidValue(
    value: FinancialTransactionStatusEnum,
  ): void {
    throw new InvalidArgumentError(`The transfer type ${value} is invalid`);
  }
}
