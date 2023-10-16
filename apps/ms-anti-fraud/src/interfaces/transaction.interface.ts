export interface TransactionPayload {
  requestId: string;
  value: number;
}

export interface TransactionStatus {
  requestId: string;
  status: string;
}
