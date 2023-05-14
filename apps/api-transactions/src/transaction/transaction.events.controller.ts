import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  InputTransactionEventApproved,
  InputTransactionEventRejected,
} from './dto/event-transaction.dtos';
import { UpdateTransactionDto } from './dto/update-transaction.input';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger;
  constructor(private transactionService: TransactionService) {
    this.logger = new Logger('Anti Fraud Events received');
  }
  @MessagePattern('transaction.approved')
  async handleTransactionApproved(
    @Payload() message: InputTransactionEventApproved,
  ) {
    const transactionExternalId = message.data.transactionExternalId;
    const updateData: UpdateTransactionDto = {
      transactionStatusId: 2,
    };

    await this.transactionService.updateTransactionByExternalUid(
      transactionExternalId,
      updateData,
    );
    this.logger.log(`${transactionExternalId} APPROVED`);
  }

  @MessagePattern('transaction.rejected')
  async handleTransactionRejected(
    @Payload() message: InputTransactionEventRejected,
  ) {
    const transactionExternalId = message.data.transactionExternalId;
    const updateData: UpdateTransactionDto = {
      transactionStatusId: 3,
      observation: message.data.reason,
    };

    await this.transactionService.updateTransactionByExternalUid(
      transactionExternalId,
      updateData,
    );

    this.logger.warn(`${transactionExternalId} REJECTED`);
  }
}
