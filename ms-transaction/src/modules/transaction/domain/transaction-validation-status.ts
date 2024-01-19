import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { EnumValueObject } from 'src/modules/shared/domain/value-object/enum-value-object';

export enum ValidationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class TransactionValidationStatus extends EnumValueObject<ValidationStatus> {
  constructor(value: ValidationStatus) {
    super(value, Object.values(ValidationStatus));
  }

  static fromValue(value: string): TransactionValidationStatus {
    for (const validationStatusValue of Object.values(ValidationStatus)) {
      if (value === validationStatusValue.toString()) {
        return new TransactionValidationStatus(validationStatusValue);
      }
    }

    throw new InvalidArgumentError(
      `Transaction validation status ${value} is invalid`,
    );
  }
}
