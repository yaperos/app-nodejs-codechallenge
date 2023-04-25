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
            const event = new TransactionRejectedEvent(transactionCreatedEvent.transactionExternalId, transactionCreatedEvent.value);

            this.kafka.emit('transaction-rejected', {
                value: JSON.stringify(event)
            });
        }
        else {
            const event = new TransactionApprovedEvent(transactionCreatedEvent.transactionExternalId, transactionCreatedEvent.value);

            this.kafka.emit('transaction-approved', {
                value: JSON.stringify(event)
            });
        }
    }
}