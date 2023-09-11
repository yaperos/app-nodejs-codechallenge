import { ObjectId } from 'mongodb';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Transaction {
  _id?: ObjectId;
  status: TransactionStatus;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;

  createdAt: Date;
  updatedAt?: Date;
}
