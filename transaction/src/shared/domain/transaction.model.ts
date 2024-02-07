import { StringHelper } from '../helper/string.helper';

export enum TransactionTypeEnum {
  BANK_TRANSFERS = 1,
  DEBIT_OR_CREDIT_CARD_PURCHASES = 2,
  LOANS = 3,
  BILL_PAYMENTS = 4,
  SALARY_AND_PAYROLL_PAYMENTS = 5,
  REFUNDS = 6,
  INTERNAL_TRANSFERS = 7,
  INVESTMENTS_AND_WITHDRAWALS = 8,
  TAX_PAYMENTS = 9,
  REFUNDS_AND_CANCELLATIONS = 10,
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface TransactionInput {
  id?: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId: TransactionTypeEnum;
  value: number;
  status?: TransactionStatus;
  createdAt?: Date;
  updateAt?: Date;
}

export interface TransactionPrimitive {
  id: string;
  value: number;
  updateAt: Date;
  createdAt: Date;
  status: TransactionStatus;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: { id: TransactionTypeEnum; name: string };
}

export interface TransactionUpdateInput {
  value: number;
  updateAt: Date;
  createdAt: Date;
  status: TransactionStatus;
  transactionType: TransactionTypeEnum;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
}

export class Transaction {
  public readonly id: string;
  public readonly value: number;
  public status: TransactionStatus;
  public readonly accountExternalIdDebit: string;
  public readonly accountExternalIdCredit: string;
  public readonly transactionTypeId: TransactionTypeEnum;

  // Metadata
  public readonly createdAt: Date;
  public updateAt: Date | undefined;

  constructor(input: TransactionInput) {
    Object.assign(this, input);
    if (!input.id) this.id = StringHelper.generateUUID();
    if (!input.createdAt) this.createdAt = new Date();
    if (!input.status) this.status = TransactionStatus.PENDING;
    this.validTransaction();
  }

  static build(input: TransactionInput) {
    return new Transaction(input);
  }

  private validTransaction() {
    // Aqui se pueden crear errores de dominio.
    if (!StringHelper.isValidUUID(this.accountExternalIdCredit))
      throw new Error('accountExternalIdCredit invalid uuid');
    if (!StringHelper.isValidUUID(this.accountExternalIdDebit))
      throw new Error('accountExternalIdDebit invalid uuid');
    if (!StringHelper.isValidUUID(this.id))
      throw new Error('Transaction id invalid uuid');
    if (!TransactionTypeEnum[this.transactionTypeId])
      throw new Error('transactionTypeId invalid');

    if (this.value <= 0) throw new Error('Invalid transaction value');
    if (!TransactionStatus[this.status]) throw new Error('Invalid status');
  }
  private changeStatus(status: TransactionStatus) {
    this.status = status;
    this.updateAt = new Date();
    this.validTransaction();
  }

  public setRejected() {
    this.changeStatus(TransactionStatus.REJECTED);
  }
  public setApproved() {
    this.changeStatus(TransactionStatus.APPROVED);
  }

  public toPrimitives(): TransactionPrimitive {
    return {
      id: this.id,
      value: this.value,
      status: this.status,
      updateAt: this.updateAt,
      createdAt: this.createdAt,
      transactionType: {
        id: this.transactionTypeId,
        name: TransactionTypeEnum[this.transactionTypeId],
      },
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
    };
  }
}
