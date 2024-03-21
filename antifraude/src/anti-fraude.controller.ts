import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { AntiFraudeService } from './anti-fraude.service';
import { ANTIFRAUDE_TRANSACTION, TRANSACTION_VALIDATED, VALIDATE_TRANSACTION } from './constants';
import { ValidateTransaction } from './types';

@Controller()
export class AntiFraudeController {
  constructor(
    @Inject(ANTIFRAUDE_TRANSACTION) private readonly clientKafka: ClientKafka,
    private readonly antiFraudeService: AntiFraudeService
  ) {}

  @EventPattern(VALIDATE_TRANSACTION)
  async validateTransaction(@Payload() payload: ValidateTransaction): Promise<void> {
    const newStatus = await this.antiFraudeService.validateTransaction(payload);    
    this.clientKafka.emit(TRANSACTION_VALIDATED, { id: payload.id, code: newStatus.valueOf() })
  }
}
