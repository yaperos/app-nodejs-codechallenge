import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VALID_TRANSACTION_TOPIC, TransactionValidDto } from '@app/common';

@Controller('antifrauds')
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern(VALID_TRANSACTION_TOPIC)
  async ValidTransactionEventHandler(@Payload() request: TransactionValidDto) {
    await this.antifraudService.validTransaction(request);
  }
}
