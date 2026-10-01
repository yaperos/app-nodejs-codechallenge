export const Topics = {
  TransactionCreated: 'transaction.created',
  TransactionStatusUpdated: 'transaction.status-updated',
} as const;

export type Topic = (typeof Topics)[keyof typeof Topics];

export const deadLetterTopic = (topic: Topic): string => `${topic}.dlq`;
