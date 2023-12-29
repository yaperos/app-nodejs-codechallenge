import { Controller, Get, Logger, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidationDto } from './models/valitation.dto';
import { TransactionService } from './transaction/transaction.service';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private transactionService: TransactionService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern(
    process.env.KAFKA_VALIDATIONS_TOPIC
      ? process.env.KAFKA_VALIDATIONS_TOPIC
      : 'validations-topic',
  )
  handleTransactionValidation(@Payload(ValidationPipe) data: ValidationDto) {
    this.logger.debug('Transaction validation arrived ' + data.id);
    this.transactionService.updateStatus(data.id, data.status);
  }
}
