import { Injectable, Logger } from '@nestjs/common';
import { EventHandlerInterface } from '../domain/service/event-handler.interface';
import { UpdateTransactionEventDto } from '../domain/dtos/update-transaction-event.dto';
import { TransactionRepositoryInterface } from '../domain/repository/transaction.repository.interface';

@Injectable()
export class UpdateTransactionService implements EventHandlerInterface {
  constructor(private readonly repository: TransactionRepositoryInterface) {}

  async handle(request: UpdateTransactionEventDto) {
    await this.repository.updateById(request.transactionId, {
      transactionStatus: request.transactionStatus,
    });
    Logger.log(`Transaction ${request.transactionId} successfully updated.`);
  }
}
