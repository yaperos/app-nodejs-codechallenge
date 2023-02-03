import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ShowTransactionDto } from '../domain/dto/show-transaction.dto';
import { AntiFraudService } from '../domain/anti-fraud.service';
import { LoggerService } from '../infraestructure/logger/logger.service';

@Controller()
export class AntiFraudController {
  private context = 'AntiFraudController';

  constructor(
    private readonly antiFraudService: AntiFraudService,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('validate-transaction')
  validateTransaction(transaction: ShowTransactionDto) {
    const context = `${this.context}-createTransaction`;
    this.logger.log(context, 'start', {
      ShowTransactionDto: transaction,
    });
    this.antiFraudService.validate(transaction);
  }
}
