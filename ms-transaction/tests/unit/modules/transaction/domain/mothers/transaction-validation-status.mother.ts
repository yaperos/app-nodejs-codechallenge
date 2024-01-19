import {
  TransactionValidationStatus,
  ValidationStatus,
} from 'src/modules/transaction/domain/transaction-validation-status';

import { EnumMother } from '../../../shared/domain/mothers';

export class TransactionValidationStatusMother {
  static random(): TransactionValidationStatus {
    return new TransactionValidationStatus(this.randomValue());
  }

  static randomValue(): ValidationStatus {
    return EnumMother.random(ValidationStatus);
  }
}
