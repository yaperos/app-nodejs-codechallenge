import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from '../transaction-created.event';
import { EventBusService } from 'src/config/events/event-bus.service';
import { plainToClass } from 'class-transformer';
import { TransactionRejectedEvent } from '../transaction-rejected.event';
import { TransactionApprovedEvent } from '../transaction-approved.event';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler
  implements IEventHandler<TransactionCreatedEvent>
{
  constructor(private readonly eventBusService: EventBusService) {}

  async handle(event: TransactionCreatedEvent) {
    const eventType =
      event.value > 1000 ? TransactionRejectedEvent : TransactionApprovedEvent;

    const transactionEvent = plainToClass(eventType, event, {
      excludeExtraneousValues: true,
    });

    this.eventBusService.publish(transactionEvent);
  }
}
