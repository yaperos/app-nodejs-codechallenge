import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionStatusDto } from './dtos/transaction-status.dto';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
  @MessagePattern('transaction_status_topic.approved')
  public async validateTransactionApproved(
    @Payload() message: TransactionStatusDto,
  ): Promise<void> {
    console.log('Received message Transaction Approved: ', message);
    await this.appService.transactionStatusUpdateApproved(message);
  }
  @MessagePattern('transaction_status_topic.rejected')
  public async validateTransactionRejected(
    @Payload() message: TransactionStatusDto,
  ): Promise<void> {
    console.log('Received message Transaction Rejected: ', message);
    await this.appService.transactionStatusUpdateRejected(message);
  }
}
