import { uuidGenerator } from '../shared/uuid-generator';

export enum TransactionStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export const TransactionType = {
  deposit: 1,
  withdraw: 2,
};

export class TransactionModel {
  public id: string;
  public transferTypeId: number;
  public value: number;
  public status: TransactionStatus;
  public accountExternalIdDebit: string;
  public accountExternalIdCredit: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(props: Partial<TransactionModel>) {
    const transactionId = props.id || uuidGenerator();
    const transactionStatus = props.status || TransactionStatus.pending;
    const createdAt = props.createdAt || new Date();

    this.id = transactionId;
    this.transferTypeId = props.transferTypeId;
    this.value = props.value;
    this.status = transactionStatus;
    this.accountExternalIdDebit = props.accountExternalIdDebit;
    this.accountExternalIdCredit = props.accountExternalIdCredit;
    this.createdAt = createdAt;
    this.updatedAt = props.updatedAt;
  }

  getTranferType(): string {
    const transferType = Object.keys(TransactionType).find((key) => TransactionType[key] === this.transferTypeId);

    if (!transferType) {
      throw new Error('Transfer type not found');
    }

    return transferType;
  }
}
