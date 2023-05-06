import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TransactionCreatedEvent } from "../transaction-created.event";
import { EventBusService } from "src/config/events/event-bus.service";
import { plainToInstance } from "class-transformer";
import { TransactionRejectedEvent } from "../transaction-rejected.event";
import { TransactionApprovedEvent } from "../transaction-approved.event";

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler
    implements IEventHandler<TransactionCreatedEvent> {

    constructor(private eventBusService: EventBusService) { }

    async handle(event: TransactionCreatedEvent) {
        if(event.value > 1000)
            this.eventBusService.publish(plainToInstance(TransactionRejectedEvent, event, {excludeExtraneousValues: true}));
        else
            this.eventBusService.publish(plainToInstance(TransactionApprovedEvent, event, {excludeExtraneousValues: true}));
    }
}