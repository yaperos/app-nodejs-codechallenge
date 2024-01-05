import { LoggerService } from '@app/shared';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transaction.service';
import { TransactionFilter } from './transaction.filter';
import { ValidationTransaction } from '@app/shared/validation-transaction/validation-transaction.interface';

@Controller()
export class TransactionController {
  constructor(
    private readonly logger: LoggerService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @UseFilters(TransactionFilter)
  @MessagePattern('updateTransaction')
  async updateTransaction(@Payload() data: ValidationTransaction) {
    this.logger.info(
      `${TransactionController.name}.updateTransaction.entry`,
      data,
    );

    const updated = await this.transactionsService.updateTransaction(
      data.transactionExternalId,
      {
        transactionStatusId: data.status,
      },
    );

    this.logger.info(
      `${TransactionController.name}.updateTransaction`,
      updated,
    );

    return JSON.stringify(updated);
  }
}
