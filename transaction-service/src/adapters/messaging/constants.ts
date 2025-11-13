export const TRANSACTIONS_CREATED_TOPIC = 'transactions.created';
export const TRANSACTIONS_STATUS_CHANGED_TOPIC = 'transactions.status.changed';

export const AVRO_SCHEMAS = {
  [TRANSACTIONS_CREATED_TOPIC]: {
    subject: 'transactions.created-value',
    file: ['..', 'contracts', 'avro', 'yape.transactions.TransactionCreated.avsc'],
  },
  [TRANSACTIONS_STATUS_CHANGED_TOPIC]: {
    subject: 'transactions.status.changed-value',
    file: ['..', 'contracts', 'avro', 'yape.transactions.TransactionStatusChanged.avsc'],
  },
} as const;

export type AvroTopic = keyof typeof AVRO_SCHEMAS;

export const isAvroTopic = (topic: string): topic is AvroTopic =>
  Object.prototype.hasOwnProperty.call(AVRO_SCHEMAS, topic);
