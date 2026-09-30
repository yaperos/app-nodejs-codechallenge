export const Topics = {
    TRANSACTION_CREATED: 'transaction.created',
    TRANSACTION_STATUS_UPDATED: 'transaction.status-updated',
} as const;

export type Topic = (typeof Topics)[keyof typeof Topics];

/** Convención única para todos los servicios: <topic>.dlq */
export const dlqTopicFor = (topic: string): string => `${topic}.dlq`;