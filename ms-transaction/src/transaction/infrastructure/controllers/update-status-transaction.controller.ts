import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateStatusTransactionService } from '../../application/update-status.transaction.service';
import { UpdateStatusTransactionDto } from '../dtos/update-status-transaction.dto';
import { EventBusConstants } from '../../../shared/domain/constants/event-bus.constants';

@Controller()
export class UpdateStatusTransactionController {
  private readonly logger = new Logger(UpdateStatusTransactionController.name);

  constructor(
    private readonly updateStatusTransactionService: UpdateStatusTransactionService,
  ) {}

  @MessagePattern(EventBusConstants.TOPIC_STATUS_TRANSACTION)
  async handler(@Payload() data: UpdateStatusTransactionDto): Promise<void> {
    this.logger.log(`[handler] ${JSON.stringify(data)}`);

    await this.updateStatusTransactionService.execute(data);
  }
}
