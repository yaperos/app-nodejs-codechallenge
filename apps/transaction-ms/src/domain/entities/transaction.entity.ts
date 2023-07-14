import { v4 as uuidv4 } from 'uuid';
import { TransferTypeEntity } from './transfer-type.entity';
import { TransactionStatusEnum } from '../enums/transaction.enum';

export class TransactionEntity {
  constructor(
    readonly transactionExternalId: string,
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly value: number,
    private _transactionStatus: TransactionStatusEnum,
    readonly transferType: TransferTypeEntity,
    readonly createdAt: Date,
  ) {}

  static create(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    value: number,
    transferType: TransferTypeEntity,
  ): TransactionEntity {
    const transaction = new TransactionEntity(
      uuidv4(),
      accountExternalIdDebit,
      accountExternalIdCredit,
      value,
      TransactionStatusEnum.PENDING,
      transferType,
      new Date(),
    );
    return transaction;
  }

  static createFromString(message: string): TransactionEntity {
    const obj = JSON.parse(message);
    const transferType = new TransferTypeEntity(
      obj.transactionType.id,
      obj.transactionType.name,
    );
    return new TransactionEntity(
      obj.transactionExternalId,
      obj.accountExternalIdDebit,
      obj.accountExternalIdCredit,
      obj.value,
      TransactionStatusEnum[obj.transactionStatus.name],
      transferType,
      obj.createdAt,
    );
  }

  toJSON(): any {
    return {
      transactionExternalId: this.transactionExternalId,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      transactionType: {
        id: this.transferType.id,
        name: this.transferType.name,
      },
      transactionStatus: {
        name: this.transactionStatus,
      },
      value: this.value,
      createdAt: this.createdAt,
    };
  }

  public get transactionStatus(): TransactionStatusEnum {
    return this._transactionStatus;
  }

  public set transactionStatus(value: TransactionStatusEnum) {
    this._transactionStatus = value;
  }
}
