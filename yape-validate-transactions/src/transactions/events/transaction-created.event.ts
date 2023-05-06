import { IEvent } from "@nestjs/cqrs"

export class TransactionCreatedEvent implements IEvent {
    
    transactionExternalId: string;

    value: number;

    transferTypeId: number;

    transactionStatusId: number;

    createdAt: Date;
}