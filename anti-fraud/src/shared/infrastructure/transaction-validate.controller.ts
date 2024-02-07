import { TransactionValidateService } from 'src/validate/infra/transaction.validate.service';
import { TransactionCreatedEventInput } from 'src/validate/domain/transaction.created.event';
import { MessageTopic } from './broker/kafka/decorators/kafka.decorator';
import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('')
@Controller('')
export class TransactionValidateController {
  private readonly logger = new Logger(TransactionValidateController.name);

  constructor(
    private readonly validateTransaction: TransactionValidateService,
  ) {}

  @MessageTopic('transaction_new-transaction')
  handle(input: TransactionCreatedEventInput) {
    this.logger.log(
      `[transaction_new-transaction] payload: ${JSON.stringify(input)}`,
    );
    return this.validateTransaction.handle(input);
  }
}
