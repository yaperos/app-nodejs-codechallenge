import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ITransactionRepository } from '../../domain/repositories/itransaction.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { TransactionStatusUpdatedRequest } from '@app/common/dto/transaction-status-updated.dto';
import { ITransactionStatusRepository } from '../../domain/repositories/istatus.repository';
import { TransactionStatusUpdatedSagaEvent } from '../saga/transaction-updated-saga.event';
import { TransactionStatusUpdatedEvent } from '@app/common/events/transaction-status-updated.event';

@EventsHandler(TransactionStatusUpdatedEvent)
export class TransactionStatusUpdatedHandler
  implements IEventHandler<TransactionStatusUpdatedEvent>
{
  constructor(
    @Inject('ITransactionRepository')
    private readonly iTransactionRepository: ITransactionRepository,
    @Inject('ITransactionStatusRepository')
    private readonly iTransactionStatusRepository: ITransactionStatusRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: TransactionStatusUpdatedEvent): Promise<void> {
    const data: TransactionStatusUpdatedRequest = event.data;

    const transaction = await this.iTransactionRepository.findById(data.id);
    if (!transaction) {
      throw new NotFoundException(`transaction not found`);
    }

    const transactionStatus = await this.iTransactionStatusRepository.findById(
      data.transactionStatusId,
    );

    transaction.updateStatus(transactionStatus);
    await this.iTransactionRepository.update(transaction);

    const eventSaga = new TransactionStatusUpdatedSagaEvent({
      id: data.id,
      transactionStatusId: transactionStatus.getId(),
      transactionStatusName: transactionStatus.getName(),
    });
    this.eventBus.publish(eventSaga);
  }
}
