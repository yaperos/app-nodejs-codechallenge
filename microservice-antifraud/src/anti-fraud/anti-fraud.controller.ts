import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventPatternEvents } from 'src/constants/event-pattern-events';
import { UpdateTransactionDTO } from './structure/dto/UpdateTransactionDTO';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @EventPattern(EventPatternEvents.ValidationTransaction)
  async transactionValidate(@Payload() payload: UpdateTransactionDTO) {
    this.antiFraudService.transactionValidate(payload);
  }
}
