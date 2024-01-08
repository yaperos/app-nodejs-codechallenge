import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionStatusDto } from './dtos/transaction-status.dto';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
  @MessagePattern('transaction_status_topic')
  public async validateTransaction(
    @Payload() message: TransactionStatusDto,
  ): Promise<void> {
    console.log('Received message', message);
    await this.appService.transactionStatusUpdate(message);
  }
}
