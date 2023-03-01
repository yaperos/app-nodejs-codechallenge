import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from '../../application-core/transaction/services/transaction.service';

@Controller()
export class EventController {
  constructor(private transactionService: TransactionService) {}

  @MessagePattern('update_transaction_status')
  async updateTransactionStatus(@Payload() message: any) {
    const { transactionExternalId, status } = message?.value;
    await this.transactionService.updateStatus(transactionExternalId, status);
  }
}
