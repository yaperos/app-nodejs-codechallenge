export const ERROR_MESSAGES = {
  KafkaConnection: 'Failed to connect to Kafka broker',
  KafkaHandleTransaction: 'Failed to handle transaction',
  KafkaProduceMessage: 'Failed to produce Kafka message',
  InvalidTransactionPayload: 'Invalid transaction payload',
  TransactionValidation: 'Invalid transaction data',
  KafkaProduceEventRetry: (attempt: number) =>
    `Attempt ${attempt}: Failed to produce event to Kafka. Retrying`,
};
