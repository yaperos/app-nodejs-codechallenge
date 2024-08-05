import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from '../../../../../../libs/common/src/events/transaction-created.event';
import { ITransactionRepository } from '../../domain/repositories/itransaction.repository';
import { Inject } from '@nestjs/common';
import { TransactionCreatedRequest } from '../../../../../../libs/common/src/dto/transaction-created.dto';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/entities/status.entity';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

@EventsHandler(TransactionCreatedEvent)
export class TransactionCreatedHandler
  implements IEventHandler<TransactionCreatedEvent>
{
  constructor(
    @Inject('ITransactionRepository')
    private readonly iTransactionRepository: ITransactionRepository,
  ) {}

  async handle(event: TransactionCreatedEvent): Promise<void> {
    const data: TransactionCreatedRequest = event.data;

    this.iTransactionRepository.create(
      Transaction.create(
        data.transactionInternalId,
        data.transactionExternalId,
        data.accountExternalIdDebit,
        data.accountExternalIdCredit,
        data.value,
        data.createdAt,
        new TransactionStatus(
          data.transactionStatus.id,
          data.transactionStatus.name,
        ),
        new TransactionType(data.transactionType.id, data.transactionType.name),
      ),
    );
  }
}
