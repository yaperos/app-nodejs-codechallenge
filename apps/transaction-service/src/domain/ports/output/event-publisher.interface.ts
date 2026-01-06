import type { RequestContext } from '@app/common';
import type { TransactionStatus } from '@domain/value-objects/transaction-status.vo';

export interface TransactionCreatedEvent {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    transactionStatus: TransactionStatus;
    createdAt: Date;
}

export interface TransactionStatusUpdatedEvent {
    transactionExternalId: string;
    transactionStatus: TransactionStatus;
}

export interface IEventPublisher {
    publishTransactionCreated(event: TransactionCreatedEvent, context?: Partial<RequestContext>): Promise<void>;
    publishTransactionStatusUpdated(event: TransactionStatusUpdatedEvent): Promise<void>;
}

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');
