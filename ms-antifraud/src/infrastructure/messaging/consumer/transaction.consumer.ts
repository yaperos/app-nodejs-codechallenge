import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT_TOPIC } from 'src/shared/utils/constant';
import { VerifyTransactionUseCase } from '../../../application/use-cases/verify-transaction.user-case';
import { LoggerService } from '../../services/logger/logger.service';
import { VerifyTransactionDto } from '../dtos/verify-transaction.dto';

@Controller()
export class TransactionConsumer {
  constructor(
    private readonly verifyTransactionUseCase: VerifyTransactionUseCase,
    private readonly loggerService: LoggerService,
  ) {}

  @EventPattern(EVENT_TOPIC.TRANSACTION.VERIFY_TRANSACTION)
  async handleTransactionEvent(@Payload() payload: VerifyTransactionDto) {
    this.loggerService.log(
      TransactionConsumer.name,
      `Received transaction event: ${JSON.stringify(payload)}`,
    );
    await this.verifyTransactionUseCase.execute(payload);
  }
}
