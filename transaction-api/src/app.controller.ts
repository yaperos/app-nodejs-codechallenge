import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  TransactionDBEventPayload,
  UpdateTransactionStatusEventPayload,
} from './transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  /*
    Consumer for update transaction status from antifraud services
  */
  @MessagePattern('updateTransactionStatus')
  updateTransactionStatusEvent(
    @Payload() payload: UpdateTransactionStatusEventPayload,
  ) {
    this.appService.updateTransactionStatusConsumer(payload);
  }

  /*
    Consumer for create/update database transaction operations events
  */
  @MessagePattern('transactionDB')
  async transactionDBEvent(@Payload() payload: TransactionDBEventPayload) {
    await this.appService.transactionDBConsumer(payload);
  }
}
