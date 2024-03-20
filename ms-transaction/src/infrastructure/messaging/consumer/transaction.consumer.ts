import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UpdateStatusTransactionUseCase } from 'src/application/use-cases/update-status-trasanction.use-case';
import { LoggerService } from 'src/infrastructure/services/logger/logger.service';
import { EVENT_TOPIC } from 'src/shared/utils/constant';
import type { VerifiedTransactionDto } from '../dtos/verified-transaction.dto';

@Controller()
export class TransactionConsumer {
  constructor(
    private readonly updateStatusUseCase: UpdateStatusTransactionUseCase,
    private readonly loggerService: LoggerService,
  ) {}

  @EventPattern(EVENT_TOPIC.TRANSACTION.UPDATE_STATUS_TRANSACTION)
  async handleTransactionEvent(@Payload() payload: VerifiedTransactionDto) {
    this.loggerService.log('Received message', JSON.stringify(payload));
    await this.updateStatusUseCase.execute(payload);
  }
}
