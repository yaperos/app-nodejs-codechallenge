import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroservicesPatterns } from '@yape/microservices';
import { TasksService } from 'src/modules/tasks/services/tasks.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly tasksService: TasksService) {}

  @EventPattern(MicroservicesPatterns.TRANSACTION_STATUS_UPDATED)
  async updateTask(@Payload() transaction: any) {
    // TODO: Add dto instead

    this.tasksService.complete(
      transaction.transactionExternalId,
      this.mapToTransaction(transaction),
    );
  }

  mapToTransaction(transaction: any) {
    // TODO: Change transferTypeId by its description.
    const {
      transactionExternalId,
      transactionType,
      status: transactionStatus,
      value,
      createdAt,
    } = transaction;

    return {
      transactionExternalId,
      transactionType: transactionType.name,
      transactionStatus,
      value,
      createdAt,
    };
  }
}
