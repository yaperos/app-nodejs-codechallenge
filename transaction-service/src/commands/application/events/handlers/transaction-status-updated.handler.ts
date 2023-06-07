import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { KafkaEventMessageAdapter } from "src/commands/infraestructure/adapters/out/kafka-event-message.adapter";
import { EventMessagePort } from "src/commands/infraestructure/ports/out/event-message.port";
import { ConfigService } from "src/config/config.service";
import { TransactionStatusUpdatedEvent } from "../impl/transaction-status-updated.event";

@EventsHandler(TransactionStatusUpdatedEvent)
export class TransactionStatusUpdatedHanlder implements IEventHandler<TransactionStatusUpdatedEvent> {
    constructor(
        @Inject(KafkaEventMessageAdapter) private readonly eventMessagePort: EventMessagePort,
        private readonly configService: ConfigService) {}

    handle(event: TransactionStatusUpdatedEvent) {
        console.log('TransactionCreatedEvent... ', event.transactionExternalId );
        console.log("enviando a kafka... ");
        this.eventMessagePort.sendMessage(this.configService.get('KAFKA_TOPIC_SYNCRONIZE_TRANSACTION'), JSON.stringify(event));
    }
}