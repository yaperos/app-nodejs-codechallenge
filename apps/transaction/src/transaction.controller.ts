import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-trasaction.dto';
import {
  END_TRANSACTION_VALIDATED,
  START_TRANSACTION_CREATED,
} from '@app/common/constans/topics';
import { AntiFraud, RequestData } from '@app/common/interfaces';

@Controller('/api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern(START_TRANSACTION_CREATED)
  async handleTransactionCreated(
    @Payload() { payload }: RequestData<CreateTransactionDto>,
    @Ctx() context: KafkaContext,
  ) {
    const transaction = await this.transactionService.create(payload);
    await this.transactionService.emitTransactionToAntiFraud(transaction);
  }

  @EventPattern(END_TRANSACTION_VALIDATED)
  async handleTransactionValidated(
    @Payload() { payload }: RequestData<AntiFraud>,
    @Ctx() context: KafkaContext,
  ) {
    const antiFraud = await this.transactionService.updateStatus(payload);
  }
}
