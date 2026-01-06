import type { EventMetadata } from '../types/tracing.types';

export interface TransactionCreatedEvent {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    transactionStatus: string;
    createdAt: Date | string;
    metadata: EventMetadata;
}

export interface TransactionStatusUpdatedEvent {
    transactionExternalId: string;
    transactionStatus: 'approved' | 'rejected';
    reason?: string;
    validatedAt?: Date | string;
    metadata: EventMetadata;
}

export interface TransactionApprovedEvent extends TransactionStatusUpdatedEvent {
    transactionStatus: 'approved';
}

export interface TransactionRejectedEvent extends TransactionStatusUpdatedEvent {
    transactionStatus: 'rejected';
    reason: string;
}
