import { Controller, Logger } from '@nestjs/common';
import { TransactionVerifyDto } from './dto/transaction-verify.dto';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetAntiFraudValidationEventCommand } from 'src/module/application/command/anti-fraud-validation.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('anti-fraud-validation')
export class AntiFraudValidationController {
  constructor(
    private readonly logger: Logger,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern('transaction-verify-ms')
  async handleEventValidateTransaction(
    @Payload() transactionVerify: TransactionVerifyDto,
  ) {
    this.logger.log('Init handleEventVerifyTransaction');
    const command = new GetAntiFraudValidationEventCommand(
      transactionVerify.transactionExternalId,
      transactionVerify.value,
    );
    await this.commandBus.execute(command);
  }
}
