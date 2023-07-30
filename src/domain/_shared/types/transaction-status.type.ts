import { StatusType } from '../constants/transactions-status.enum';

export interface TransactionStatus extends TransactionStatusData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionStatusData = {
  status: StatusType;
};
