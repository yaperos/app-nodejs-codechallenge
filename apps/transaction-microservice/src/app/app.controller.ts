import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from '@nestjs-microservices/shared/dto';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.create')
  handleProcessTransaction(@Payload() data: CreateTransactionDto) {
    this.appService.createTransaction(data);
  }

  @EventPattern('transaction.status')
  handleTransactionUpdate(@Payload() data: UpdateTransactionStatusDto) {
    this.appService.updateTransactionStatus(data);
  }

  @MessagePattern('transaction.get')
  async handleGetTransaction(@Payload() data: { id: string }) {
    const transaction = await this.appService.getTransactionById(data.id);
    console.log('Transaction: ', transaction);
    return {
      value: transaction,
    };
  }
}
