import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionCreated } from './domain/transaction';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService 
  ) {}

  @MessagePattern('KAFKA_TOPIC_TRANSACTION_CREATED')
  public transactionCreated(@Payload() payload: TransactionCreated){ 
    Logger.log('INICIANDO VALIDACION')
    this.appService.validateTransaction(payload);
  }
}
