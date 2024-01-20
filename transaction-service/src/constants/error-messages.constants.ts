export const ERROR_MESSAGES = {
  KafkaConnection: 'Failed to connect to Kafka broker',
  KafkaHandleTransaction: 'Failed to handle transaction',
  KafkaProduceMessage: 'Failed to produce Kafka message',
  InvalidTransactionPayload: 'Invalid transaction payload',
  TransactionValidation: 'Invalid transaction data',
  KafkaProduceEventRetry: (attempt: number) =>
    `Attempt ${attempt}: Failed to produce event to Kafka. Retrying`,
  TransactionCreateError: 'There was a problem creating the transaction',
  TransactionNotFoundError: 'Transaction not found',
  InternalServerError: 'Internal server error',
  TransactionSaveError: 'Failed to save transaction',
  PendingStatusNotFoundError: 'Default pending status not found',
  TransferTypeNotFoundError: 'Transfer type not found',
  StatusNotFoundError: 'Status not found',
  TransactionStatusNotFoundError: 'Transaction status not found',
};
