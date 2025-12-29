export const KAFKA_TOPICS = {
  TRANSACTION_CREATED: 'transaction-created',
  TRANSACTION_VALIDATED: 'transaction-validated',
} as const;

export const KAFKA_CONSUMER_GROUPS = {
  ANTI_FRAUD: 'anti-fraud-consumer-group',
  TRANSACTION: 'transaction-consumer-group',
} as const;
