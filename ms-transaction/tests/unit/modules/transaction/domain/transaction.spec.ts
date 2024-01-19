import { Transaction } from 'src/modules/transaction/domain/transaction';

import { DateMother } from '../../shared/domain/mothers';
import { TransactionMother } from './mothers/transaction.Mother';
import { TransactionAccountExternalIdMother } from './mothers/transaction-account-external-id.Mother';
import { TransactionAmountMother } from './mothers/transaction-amount.Mother';
import { TransactionIdMother } from './mothers/transaction-id.Mother';
import { TransactionTransferTypeMother } from './mothers/transaction-transfer-type.Mother';
import { TransactionValidationStatusMother } from './mothers/transaction-validation-status.Mother';

describe('Transaction test', () => {
  it('should be instantiated correctly', () => {
    const transactionObject = {
      id: TransactionIdMother.randomValue(),
      creditAccountExternalId: TransactionAccountExternalIdMother.randomValue(),
      debitAccountExternalId: TransactionAccountExternalIdMother.randomValue(),
      amount: TransactionAmountMother.randomValue(),
      transferType: TransactionTransferTypeMother.randomValue(),
      validationStatus: TransactionValidationStatusMother.randomValue(),
      createdAt: DateMother.random(),
      updatedAt: DateMother.random(),
    };

    expect(
      Transaction.fromPrimitives({ ...transactionObject }).toPrimitives(),
    ).toEqual(transactionObject);
  });

  it('should correctly return the getters functions', () => {
    const transactionTransferType = TransactionTransferTypeMother.random();

    const id = TransactionIdMother.randomValue();
    const creditAccountExternalId =
      TransactionAccountExternalIdMother.randomValue();
    const debitAccountExternalId =
      TransactionAccountExternalIdMother.randomValue();
    const amount = TransactionAmountMother.randomValue();
    const transferType = transactionTransferType.value;
    const validationStatus = TransactionValidationStatusMother.randomValue();

    const transaction = TransactionMother.create({
      id,
      creditAccountExternalId,
      debitAccountExternalId,
      amount,
      transferType,
      validationStatus,
    });
    expect(transaction.getId()).toEqual(id);
    expect(transaction.getCreditAccountExternalId()).toEqual(
      creditAccountExternalId,
    );
    expect(transaction.getDebitAccountExternalId()).toEqual(
      debitAccountExternalId,
    );
    expect(transaction.getAmount()).toEqual(amount);
    expect(transaction.getTransferType()).toEqual(transferType);
    expect(transaction.getTransferTypeName()).toEqual(
      transactionTransferType.getName(),
    );
    expect(transaction.getValidationStatus()).toEqual(validationStatus);
  });
});
