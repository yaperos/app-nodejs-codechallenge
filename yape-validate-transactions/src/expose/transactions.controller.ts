import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventBusService } from 'src/config/events/event-bus.service';

@Controller()
export class TransactionsController {
    constructor(private eventBusService: EventBusService) { }

    @EventPattern('yape-transactions-created-topic')
    handleTransactionCreated(@Payload() message: any) {
        this.eventBusService.handle(message);
    }
}