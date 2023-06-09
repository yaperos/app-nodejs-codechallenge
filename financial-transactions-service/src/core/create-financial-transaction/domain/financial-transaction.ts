import { NumberValueObject } from '../../../shared/domain/value-object/NumberValueObject';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { ValueObject } from '../../../shared/domain/value-object/ValueObject';
import { Account } from './account';
import { FinancialTransactionCreationDate } from './financial-transaction-creation-date';
import { FinancialTransactionId } from './financial-transaction-id';
import { FinancialTransactionStatus } from './financial-transaction-status';
import { FinancialTransactionType } from './financial-transaction-type';
import { FinancialTransactionValue } from './financial-transaction-value';

export class FinancialTransaction {
  readonly id: FinancialTransactionId;
  readonly accountDebit: Account;
  readonly accountCredit: Account;
  readonly value: NumberValueObject;
  readonly type: FinancialTransactionType;
  readonly status: FinancialTransactionStatus;
  readonly createdAt: ValueObject<Date>;

  constructor(
    id: FinancialTransactionId,
    accountExternalDebit: Account,
    accountExternalCredit: Account,
    value: FinancialTransactionValue,
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
  ) {
    this.id = id;
    this.accountDebit = accountExternalDebit;
    this.accountCredit = accountExternalCredit;
    this.value = value;
    this.type = type;
    this.status = status;
    this.createdAt = new FinancialTransactionCreationDate(new Date());
  }

  static fromPrimitives(plainData: {
    id: string;
    accountDebitId: string;
    accountCreditId: string;
    value: number;
    transferTypeId: string;
    transferStatusId: string;
  }): FinancialTransaction {
    return new FinancialTransaction(
      new FinancialTransactionId(plainData.id),
      new Account(new Uuid(plainData.accountDebitId)),
      new Account(new Uuid(plainData.accountCreditId)),
      new FinancialTransactionValue(plainData.value),
      FinancialTransactionType.fromValue(plainData.transferTypeId),
      FinancialTransactionStatus.fromValue(plainData.transferStatusId),
    );
  }
}
