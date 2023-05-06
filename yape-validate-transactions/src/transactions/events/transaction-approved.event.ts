import { IEvent } from "@nestjs/cqrs"
import { Expose } from "class-transformer";

export class TransactionApprovedEvent implements IEvent {
    
    @Expose()
    transactionExternalId: string;

    @Expose()
    value: number;
}