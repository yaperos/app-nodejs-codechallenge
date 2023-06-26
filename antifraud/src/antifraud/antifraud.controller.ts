import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntifraudService } from './antifraud.service';

export const TRANSACTION_CREATED = 'transaction-created';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern(TRANSACTION_CREATED)
  public async handleTransactionCreated(
    @Payload() transaction: { id: string; value: number },
  ): Promise<string> {
    return this.antifraudService.validateTransaction(transaction);
  }
}
