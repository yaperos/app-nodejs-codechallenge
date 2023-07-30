import { Type } from '../constants/transaction-type.enum';

export interface TransactionType extends TransactionTypeData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionTypeData = {
  type: Type;
};
