export const enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type StatusStrings = `${Status}`;

export const TRANSACTION_CREATED = 'transaction_created';
export const TRANSACTION_VALIDATED = 'transaction_validated';
