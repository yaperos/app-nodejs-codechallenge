import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ITransactionRepository } from '../../domain/repositories/itransaction.repository';
import { Inject } from '@nestjs/common';
import { TransactionStatus } from '../../domain/entities/status.entity';
import { TransactionStatusUpdatedRequest } from '@app/common/dto/transaction-status-updated.dto';
import { TransactionReadStatusUpdatedEvent } from '@app/common/events/transaction-read-status-updated.event';

@EventsHandler(TransactionReadStatusUpdatedEvent)
export class TransactionStatusUpdatedHandler
  implements IEventHandler<TransactionReadStatusUpdatedEvent>
{
  constructor(
    @Inject('ITransactionRepository')
    private readonly iTransactionRepository: ITransactionRepository,
  ) {}

  async handle(event: TransactionReadStatusUpdatedEvent): Promise<void> {
    const data: TransactionStatusUpdatedRequest = event.data;

    this.iTransactionRepository.updateStatusByExternalId(
      data.id,
      new TransactionStatus(
        data.transactionStatusId,
        data.transactionStatusName,
      ),
    );
  }
}
