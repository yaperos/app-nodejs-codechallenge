export const KAFKA_PRODUCER = Symbol('KAFKA_PRODUCER');
export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');
export const KAFKA_OPTIONS = Symbol('KAFKA_OPTIONS');

export enum KafkaTopics {
    TRANSACTION_CREATED = 'transaction-created',
    TRANSACTION_APPROVED = 'transaction-approved',
    TRANSACTION_REJECTED = 'transaction-rejected',
}
