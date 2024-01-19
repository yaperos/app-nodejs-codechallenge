import { Transaction } from 'src/modules/transaction/domain/transaction';
import { DateMother } from 'tests/unit/modules/shared/domain/mothers';

import { TransactionAccountExternalIdMother } from './transaction-account-external-id.Mother';
import { TransactionAmountMother } from './transaction-amount.Mother';
import { TransactionIdMother } from './transaction-id.Mother';
import { TransactionTransferTypeMother } from './transaction-transfer-type.Mother';
import { TransactionValidationStatusMother } from './transaction-validation-status.Mother';

export class TransactionMother {
  static create({
    id = TransactionIdMother.randomValue(),
    creditAccountExternalId = TransactionAccountExternalIdMother.randomValue(),
    debitAccountExternalId = TransactionAccountExternalIdMother.randomValue(),
    amount = TransactionAmountMother.randomValue(),
    transferType = TransactionTransferTypeMother.randomValue(),
    validationStatus = TransactionValidationStatusMother.randomValue(),
    createdAt = DateMother.random(),
    updatedAt = DateMother.random(),
  }: {
    id?: string;
    creditAccountExternalId?: string;
    debitAccountExternalId?: string;
    amount?: number;
    transferType?: string;
    validationStatus?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Transaction {
    return Transaction.fromPrimitives({
      id,
      creditAccountExternalId,
      debitAccountExternalId,
      amount,
      transferType,
      validationStatus,
      createdAt,
      updatedAt,
    });
  }

  static random(): Transaction {
    return new Transaction({
      id: TransactionIdMother.random(),
      creditAccountExternalId: TransactionAccountExternalIdMother.random(),
      debitAccountExternalId: TransactionAccountExternalIdMother.random(),
      amount: TransactionAmountMother.random(),
      transferType: TransactionTransferTypeMother.random(),
      validationStatus: TransactionValidationStatusMother.random(),
    });
  }
}
