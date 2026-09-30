import { OutboxRepositoryPort } from "./outbox.repository.port";
import { ProcessedMessageRepositoryPort } from "./processed-message.repository.port";
import { TransactionRepositoryPort } from "./transaction.repository.port";

export interface TransactionalContext {
    transactions: TransactionRepositoryPort;
    outbox: OutboxRepositoryPort;
    processedMessages: ProcessedMessageRepositoryPort;
}

export abstract class UnitOfWorkPort {
    abstract run<T>(work: (ctx: TransactionalContext) => Promise<T>): Promise<T>;
}