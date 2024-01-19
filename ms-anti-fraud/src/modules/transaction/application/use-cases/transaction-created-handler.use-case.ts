import { Injectable } from '@nestjs/common';
import { AmountService } from 'src/modules/shared/domain/services/amount.service';
import { EventBrokerService } from 'src/modules/shared/domain/services/event-broker.service';
import { TransactionApprovedEvent } from 'src/modules/transaction/domain/transaction-approved.event';
import { TransactionCreatedEvent } from 'src/modules/transaction/domain/transaction-created.event';
import { TransactionRejectedEvent } from 'src/modules/transaction/domain/transaction-rejected.event';

@Injectable()
export class TransactionCreatedHandler {
  constructor(
    private readonly amountService: AmountService,
    private readonly eventBrokerService: EventBrokerService,
  ) {}

  async run(event: TransactionCreatedEvent): Promise<void> {
    let domainEvent: TransactionApprovedEvent | TransactionRejectedEvent;
    if (this.amountService.isValid(event.amount)) {
      domainEvent = new TransactionApprovedEvent({
        aggregateId: event.aggregateId,
      });
    } else {
      domainEvent = new TransactionRejectedEvent({
        aggregateId: event.aggregateId,
      });
    }
    await this.eventBrokerService.publish([domainEvent]);
  }
}
