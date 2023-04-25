import { TransactionApprovedEvent, TransactionCreatedEvent, TransactionRejectedEvent } from "@app/common/events";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AntifraudServiceService {
    constructor(
        @Inject("VALIDATE_SERVICE")
        private readonly kafka: ClientProxy
    ) { }

    validateTransaction(transactionCreatedEvent: TransactionCreatedEvent) {
        if (transactionCreatedEvent.value > 1000) {
            const event: TransactionRejectedEvent = {
                transactionExternalId: transactionCreatedEvent.transactionExternalId,
                value: transactionCreatedEvent.value,
                rejectedAt: new Date()
            }
            this.kafka.emit('transaction-rejected', {
                value: event
            });
        }
        else {
            const event: TransactionApprovedEvent = {
                transactionExternalId: transactionCreatedEvent.transactionExternalId,
                value: transactionCreatedEvent.value,
                approvedAt: new Date()
            }
            this.kafka.emit('transaction-approved', {
                value: event
            });
        }
    }
}