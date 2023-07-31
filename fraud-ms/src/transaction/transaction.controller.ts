import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from './entities/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('transactions-pending')
  async createdTransactionsListener(
    @Payload() data: TransactionDTO,
  ): Promise<void> {
    await this.transactionService.processNewTransaction(data);
  }
}
