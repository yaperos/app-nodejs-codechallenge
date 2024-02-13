import { StatusStrings } from '../constants';

export interface TransactionEvent {
  transactionId: string;
  amount: number;
  status: StatusStrings;
  sent: Date;
}

export interface RequestData<T> {
  payload: T;
}
