import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TransactionInterface, TransactionImplement, STATUS_TYPE } from './transaction';

export class TransactionFactory {
  constructor(@Inject(EventPublisher) private readonly eventPublisher: EventPublisher) {}

  create(id: string, transactionStatus: STATUS_TYPE, value: number): TransactionInterface {
    return this.eventPublisher.mergeObjectContext(
      new TransactionImplement({
        id,
        transactionStatus,
        value,
      }),
    );
  }
}
