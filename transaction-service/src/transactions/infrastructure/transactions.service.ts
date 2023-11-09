import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { ProducerService } from 'src/kafka/producer.service';
import { RetrieveTransaction } from '../domain/transaction.entity';
import { TransactionsRepository } from './repository';
import { ITransactionsServiceUseCase } from '../aplication/transactionUseCases';


@Injectable()
export class TransactionsService implements ITransactionsServiceUseCase {
  constructor(
    private readonly producerService: ProducerService,
    private readonly transactionRepository: TransactionsRepository
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

  async delete(id: string): Promise<DeleteResult> {
    return this.transactionRepository.delete(id)
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
