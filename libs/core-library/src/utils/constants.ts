export enum TRANSACTION_STATUS {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum TRANSACTION_TYPE {
  TRANSFER = 1,
  WITHDRAWAL = 2,
}

export enum TRANSACTION_EVENT_ID {
  CREATED = 'transaction.created',
  UPDATE = 'transaction.update',
}

export const MAX_VALUE_RULE = 1000;

export const GROUP_ID = 'transaction_consumer';
export const CLIENT_TRANSACTION_NAME = 'KAFKA_TRANSACTION_SERVICE';
export const CLIENT_TRANSACTION_ID = 'transaction';
export const CLIENT_MS_TRANSACTION_ID = 'ms-transaction';
export const CLIENT_ANTI_FRAUD_NAME = 'KAFKA_ANTI_FRAUD_SERVICE';
export const CLIENT_ANTI_FRAUD_ID = 'anti-fraud';

export enum DATA_BASE_TYPE {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}
