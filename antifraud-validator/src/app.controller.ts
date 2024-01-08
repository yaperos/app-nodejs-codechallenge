import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dtos/create-transaction.dto';
import { TransactionStatusDto } from './dtos/transaction-status.dto';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
  @MessagePattern('transaction_created_topic')
  public async validateTransaction(
    @Payload() message: TransactionDto,
  ): Promise<void> {
    console.log('message: ', message);
    const auditedStatus = this.appService.validateTransaction(message);
    const transactionStatus: TransactionStatusDto = {
      transactionExternalId: message.transactionExternalId,
      transactionType: { name: message.transferTypeId.toString() },
      transactionStatus: { name: auditedStatus },
      value: message.value,
      createdAt: new Date().toISOString(),
    };
    await this.appService.sendTransactionStatus(transactionStatus);
  }
}
