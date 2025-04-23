export interface TransactionStatus {
  code: string;
  name: string;
  description?: string;
}

export interface TransactionType {
  id: number;
  name: string;
}

export const TRANSACTION_STATUS_CODES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
