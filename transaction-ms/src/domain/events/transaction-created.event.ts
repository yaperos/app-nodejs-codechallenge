import { Transaction } from "../entities/transaction.entity";

export class TransactionCreatedDomainEvent {
    private constructor(
        readonly transactionId: string,
        readonly ocurredAt: Date
    ) { }

    static from(transaction: Transaction): TransactionCreatedDomainEvent {
        return new TransactionCreatedDomainEvent(transaction.id, transaction.createdAt);
    }
}