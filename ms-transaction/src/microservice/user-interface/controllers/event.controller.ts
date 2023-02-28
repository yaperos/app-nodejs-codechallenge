import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage, Producer } from 'kafkajs';
import { TransactionService } from '../../application-core/transaction/services/transaction.service';

@Controller()
export class EventController {
  constructor(private transactionService: TransactionService) {}

  @MessagePattern('update_transaction_status')
  async updateTransactionStatus(@Payload() message: any) {
    const { transactionExternalId, status } = message?.value;
    console.log(
      `updateTransactionStatus message: ${JSON.stringify(
        message.value,
        null,
        3,
      )}`,
    );
    await this.transactionService.updateStatus(transactionExternalId, status);
  }
}
