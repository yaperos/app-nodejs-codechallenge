import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionValidateRequestDto } from 'src/dtos/transaction-validate-request.dto';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.created')
  handleTransactionCreated(
    @Payload('data') data: TransactionValidateRequestDto,
  ) {
    this.logger.log('Transaction Created', data);
    this.appService.validateTransaction(data);
  }
}
