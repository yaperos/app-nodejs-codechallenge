import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TransactionCreatedDto } from './dto/transaction-created.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.created')
  async handleTransactionCreated(
    @Payload(new ValidationPipe()) message: TransactionCreatedDto,
  ) {
    Logger.log('Transaction created');
    Logger.log(message);
    const { id, value } = message;
    return this.appService.handleTransactionCreated(id, value);
  }
}
