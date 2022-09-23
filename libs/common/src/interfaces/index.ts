export type TRANSACTION_STATUS = 'pending' | 'approved' | 'rejected';

export interface AntiFraud {
  transactionId: string;
  value: number;
  status: TRANSACTION_STATUS;
}

export interface RequestData<T> {
  payload: T;
}
