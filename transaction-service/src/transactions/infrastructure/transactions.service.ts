import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { RetrieveTransaction } from '../domain/transaction.entity';
import { ITransactionsServiceUseCase } from '../aplication/transactionUseCases';
import { IProducerService } from '../domain/producer.interface';
import { ITransactionsRepository } from '../domain/repository.interface';


@Injectable()
export class TransactionsService implements ITransactionsServiceUseCase {
  constructor(
    @Inject('IProducerService') private readonly producerService: IProducerService,
    @Inject('ITransactionsRepository') private readonly transactionRepository: ITransactionsRepository
  ) {}

  async retrieveTransaction(id: string): Promise<RetrieveTransaction> {
    return await this.transactionRepository.retrieve(id)
  }

  async retrieveAll():Promise<RetrieveTransaction[]>{
    return await this.transactionRepository.retrieveAll()
  }

  async transaction(
    data: CreateTransactionInput,
  ): Promise<RetrieveTransaction> {
    this.validateTransactionValue(data.value);

    const response = await this.transactionRepository.transaction(data)

    this.sendMessageToAntiFraudService(response.transactionStatus.id)

    return response
    
  }

  private async sendMessageToAntiFraudService(id: string) {
    try {
      Logger.log('Sending..');
      await this.producerService.produce('anti-fraud', {
        value: id,
      });
    } catch (error) {
      Logger.error('Send Kafka error', error);
    }
  }

  private validateTransactionValue(value: number) {
    if (value < 1 || value > 1000) {
      throw new Error('Transaction rejected');
    }
  }
}
