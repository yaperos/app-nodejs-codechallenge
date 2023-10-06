import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { ANTI_FRAUD_VALIDATION, TRANSACTION_UPDATED } from './constant/patterns';
import { TransactionToValidate } from './dto/transactionToValidate.dto';
import { ValidatedTransaction } from './dto/transaction.dto';

@Controller()
export class AppController {
  private logger: Logger;
  constructor(private readonly appService: AppService) {
    this.logger = new Logger(AppController.name)
  }


  @EventPattern(ANTI_FRAUD_VALIDATION)
  private async validate(data: TransactionToValidate):Promise<void> {
    const response: ValidatedTransaction = await this.appService.validate(data);
    this.logger.log(`Validated Object`)
    console.log(response)
    this.appService.emitEventToKafkaTopic(TRANSACTION_UPDATED, response);

  }

}
 