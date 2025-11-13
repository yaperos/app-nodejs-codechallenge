import { Inject, Injectable, Logger } from '@nestjs/common';
import { approveOrReject } from '@domain/decision';
import {
  TransactionCreatedEvent,
  TransactionStatusChangedEvent,
} from '@domain/events';
import { EventPublisher } from '@ports/out/event-publisher';
import { STATUS_EVENT_PUBLISHER } from '@ports/tokens';

@Injectable()
export class OnTransactionCreatedService {
  private readonly logger = new Logger(OnTransactionCreatedService.name);

  constructor(
    @Inject(STATUS_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async handle(event: TransactionCreatedEvent): Promise<void> {
    this.logger.debug(`Evaluating transaction ${event.transactionExternalId}`);
    const evaluation = approveOrReject({ value: event.value });

    const statusEvent: TransactionStatusChangedEvent = {
      transactionExternalId: event.transactionExternalId,
      status: evaluation.status,
      reason: evaluation.reason,
      evaluatedAt: new Date(),
    };

    await this.eventPublisher.publishStatusChanged(statusEvent);
  }
}
