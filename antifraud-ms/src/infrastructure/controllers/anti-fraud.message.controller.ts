import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProcessTransactionUseCase } from 'src/application/use-cases/process-transaction.usecase';
import { TransactionModel } from 'src/domain/models/transaction.model';
import { KafkaProducer } from '../kafka/kafka.producer';

@Controller()
export class AntiFraudMessageController {
  constructor(
    private readonly processTransactionUseCase: ProcessTransactionUseCase,
    private readonly kafkaProducer: KafkaProducer,
  ) {}


  @MessagePattern('transaction-created-topic')
  async handleTransactionCreated(@Payload() message: any) {
    
    const transaction = message.value as TransactionModel;


    const status = await this.processTransactionUseCase.execute(transaction);


    await this.kafkaProducer.send('transaction-status-updated-topic', {
      transactionExternalId: transaction.transactionExternalId,
      status,
    });

    return { success: true };
  }
}
