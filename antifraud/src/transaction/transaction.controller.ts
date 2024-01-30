import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { ConsumeTransactionDto } from './dto/consume-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
  ) {}

  @MessagePattern('transaction-created')
  async consumeTransaction(
    @Payload() transaction: ConsumeTransactionDto,
  ): Promise<any> {
    try {
      console.log(
        'Received transaction:',
        transaction,
      );
      await this.transactionService.checkFraud(
        transaction,
      );
    } catch (error) {
      console.error(
        'Error processing transaction:',
        error,
      );
      throw new Error(
        'Failed to process transaction',
      );
    }
  }
}
