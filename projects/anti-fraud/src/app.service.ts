import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './models/transaction-created.event';
import { TransactionRejectedEvent } from './models/transaction-rejected.event';
import { TransactionApprovedEvent } from './models/transaction-approved.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA')
    private readonly eventBus: ClientKafka,
  ) {}

  async evaluateTransaction(payload: TransactionCreatedEvent): Promise<void> {
    const evaluatedEvent =
      payload.value > 1000
        ? TransactionRejectedEvent
        : TransactionApprovedEvent;
    this.eventBus.emit(
      evaluatedEvent.getName(),
      evaluatedEvent.toEvent(payload),
    );
  }
}
