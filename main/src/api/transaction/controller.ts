import { Controller } from '@nestjs/common';
import { TransactionService } from 'src/core/transaction/service'
import { TransactionSqlRepository } from 'src/repos/transaction/repository';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { TransactionMsg } from 'src/core/transaction/query';


@Controller()
export class TransactionController {
    private transactionService: TransactionService
    constructor(transactionRepository: TransactionSqlRepository) {
      this.transactionService = new TransactionService(transactionRepository)
    }

  @MessagePattern('validated_txn')
  async readMessage(@Payload() originalMessage: any, @Ctx() context: KafkaContext) {

    const message = originalMessage as unknown as TransactionMsg

    const transaction = await this.transactionService.update(message.id, message.status)
    console.log({ transaction })

    return { is_validated: true };
  }
}
