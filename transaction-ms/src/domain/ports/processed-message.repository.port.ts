export abstract class ProcessedMessageRepositoryPort {
    abstract markProcessed(consumer: string, messageId: string): Promise<boolean>;
}