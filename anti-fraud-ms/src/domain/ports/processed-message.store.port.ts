export abstract class ProcessedMessageStorePort {
    abstract wasProcessed(eventId: string): Promise<boolean>;
    abstract markProcessed(eventId: string): Promise<void>;
}