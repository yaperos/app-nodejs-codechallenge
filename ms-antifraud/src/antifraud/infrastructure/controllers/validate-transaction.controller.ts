import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionService } from '../../application/validate-transaction.service';
import { ValidateTransactionDto } from '../dtos/validate-transaction.dto';
import { EventBusConstants } from '../../../shared/domain/constants/event-bus.constants';

@Controller()
export class ValidateTransactionController {
  private readonly logger = new Logger(ValidateTransactionController.name);

  constructor(private validateTransactionService: ValidateTransactionService) {}
  @MessagePattern(EventBusConstants.TOPIC_NEW_TRANSACTION)
  async handler(@Payload() data: ValidateTransactionDto) {
    this.logger.log(`[handler] ${JSON.stringify(data)}`);

    await this.validateTransactionService.execute(data);
  }
}
