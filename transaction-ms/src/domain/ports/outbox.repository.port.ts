export interface OutboxMessage {
    eventId: string;
    aggregateId: string;
    topic: string;
    key: string;
    payload: unknown;
}

export abstract class OutboxRepositoryPort {
    abstract add(message: OutboxMessage): Promise<void>;
}