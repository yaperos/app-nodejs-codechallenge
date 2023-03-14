import { Document } from 'mongoose';

export enum EnumStatus {
  'pending' = 'pending',
  'approved' = 'approved',
  'rejected' = 'rejected',
}
export interface ITransaction {
  transactionExternalId: string;

  transactionStatus: Record<string, EnumStatus>;

  tranferTypeId: number;

  value: number;

  createdAt: Date;

  updatedAt: Date;
}
export interface TransactionDocument extends ITransaction, Document {}
