import { TransactionsManagerService } from 'src/transactions/application/transactions-manager.service';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionStatusDto } from 'src/transactions/infrastructure/in/dtos/update-transacton--status.dto';

@Controller()
export class EventsController {
  constructor(private readonly ts: TransactionsManagerService) {}

  @EventPattern('transaction.verified')
  async onTransactionVerified(@Payload() dto: UpdateTransactionStatusDto) {
    await this.ts.updateTransactionStatus(dto);
  }
}
