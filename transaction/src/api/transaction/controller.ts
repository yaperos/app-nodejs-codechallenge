import { Controller } from '@nestjs/common';
import { TransactionService } from 'src/core/transaction/service'
import { TransactionSqlRepository } from 'src/repos/transaction/repository';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Transaction, TransactionMsg } from 'src/core/transaction/query';
import { TransactionStatus } from '@prisma/client';

@Controller()
export class TransactionController {
  private transactionService: TransactionService
  constructor( transactionRepository: TransactionSqlRepository) {
    this.transactionService = new TransactionService(transactionRepository)

  }

  @MessagePattern('transaction_topic')
  async readMessage(@Payload() originalMessage: any, @Ctx() context: KafkaContext) {

    const message = originalMessage as unknown as Transaction
    let transaction = await this.transactionService.getById(message.id)

    const transactionMsg:TransactionMsg = { id:transaction.id, status: TransactionStatus.REJECTED }
    if (transaction.value <= 1000) {
      transactionMsg.status = TransactionStatus.APPROVED
    }

    const buffer = Buffer.from(JSON.stringify(transactionMsg));

    const producer = context.getProducer()
    producer.send({
      topic: "validated_txn",
      messages: [{
        value: buffer,
        partition: 0
      }]
    })

    /*
    const originalMessage = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    console.log({ topic, partition, originalMessage })
    */
    return { is_validated: true };
  }
}
