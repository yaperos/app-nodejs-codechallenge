import { Injectable, Logger } from '@nestjs/common';
import { TransactionRepositoryInterface } from '../domain/repository/transaction.repository.interface';
import { EventHandlerInterface } from '../domain/service/event-handler.interface';
import { CreateTransactionEventDto } from '../domain/dtos/create-transaction-event.dto';
import { Builder } from 'builder-pattern';
import { TransactionEntityDto } from '../domain/dtos/entities/transaction-entity.dto';
import { TransactionStatus } from '../domain/enums/transaction-status';

@Injectable()
export class CreateTransactionService implements EventHandlerInterface {
  constructor(private readonly repository: TransactionRepositoryInterface) {}

  async handle(request: CreateTransactionEventDto) {
    const entity = Builder<TransactionEntityDto>()
      .transactionExternalId(request.transactionId)
      .transactionType(request.transferTypeId)
      .value(request.value)
      .accountExternalIdDebit(request.accountExternalIdDebit)
      .accountExternalIdCredit(request.accountExternalIdCredit)
      .transactionStatus(TransactionStatus.PENDING)
      .build();
    await this.repository.create(entity);
    Logger.log(`Transaction ${request.transactionId} successfully created.`);
  }
}
