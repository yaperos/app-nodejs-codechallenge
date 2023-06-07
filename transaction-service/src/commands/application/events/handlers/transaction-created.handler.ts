import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TransactionCreatedEvent } from "../impl/transaction-created.event";
import { Inject } from "@nestjs/common";
import { KafkaEventMessageAdapter } from "src/commands/infraestructure/adapters/out/kafka-event-message.adapter";
import { EventMessagePort } from "src/commands/infraestructure/ports/out/event-message.port";
import { ConfigService } from "src/config/config.service";

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler implements IEventHandler<TransactionCreatedEvent> {
    constructor(
        @Inject(KafkaEventMessageAdapter) private readonly eventMessagePort: EventMessagePort,
        private readonly configService: ConfigService) {}

    handle(event: TransactionCreatedEvent) {
        console.log('TransactionCreatedEvent... ', event.transactionExternalId );
        console.log("enviando a kafka... ");
        this.eventMessagePort.sendMessage(this.configService.get('KAFKA_TOPIC_TRANSACTION_CREATED'), JSON.stringify({"idTransaction": event.transactionExternalId }));
        this.eventMessagePort.sendMessage(this.configService.get('KAFKA_TOPIC_SYNCRONIZE_TRANSACTION'), JSON.stringify(event));
    }
}