export const MAX_TRANSACTION_VALUE = 1000;

export enum TRANSACTION_STATUS {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const TRANSACTION_CREATED_EVENT_TOPIC = 'transaction.created';
export const TRANSACTION_CHECKED_EVENT_TOPIC = 'transaction.checked';
