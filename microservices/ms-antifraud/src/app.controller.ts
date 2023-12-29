import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionDto } from './models/Transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(
    process.env.KAFKA_TOPIC ? process.env.KAFKA_TOPIC : 'transactions-topic',
  )
  handleTransactionCreation(@Payload(ValidationPipe) data: TransactionDto) {
    this.appService.processTransaction(data);
  }
}
