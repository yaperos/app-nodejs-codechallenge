import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionCreatedEvent } from './dto/transaction-created.event';
import { TransactionReponse } from './dto/transaction-response.event';
import { validateTransaction } from './utils';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern("transaction_created")
  async handleTransactionReceived(@Payload() transactionCreated: TransactionCreatedEvent){
    const result = validateTransaction(transactionCreated.value)
    const response: TransactionReponse = {
      id: transactionCreated.id,
      isValid: result
    }
    return response
  }

}
