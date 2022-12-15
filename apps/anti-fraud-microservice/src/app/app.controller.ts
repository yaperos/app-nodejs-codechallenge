import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionCreatedEvent } from '@nodejs-codechallenge/shared/dto';

@Controller()
export class AppController {
  
  private readonly logger = new Logger('AppController');

  constructor(
    private readonly appService: AppService) 
  {}

  @MessagePattern(process.env.TRANSACTION_TOPIC_NAME)
  validateTransaction(@Payload() transactionCreatedEvent: TransactionCreatedEvent) {
    this.logger.log(`Event incoming ${transactionCreatedEvent}`);
    return this.appService.validateTransaction(transactionCreatedEvent);
  }
}
