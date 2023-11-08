import { Injectable, Logger } from '@nestjs/common';
import {
  RetrieveTransaction,
  TransactionStatus,
  TransactionType,
} from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(RetrieveTransaction)
    private transactionRepository: Repository<RetrieveTransaction>,
    @InjectRepository(TransactionStatus)
    private transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
    private readonly producerService: ProducerService,
  ) {}

  async retrieve(id: string): Promise<RetrieveTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: id,
      },
    });

    if (!transaction) {
      throw new Error(`La transacción con ID ${id} no se encontró.`);
    }

    return transaction;
  }

  async transaction(
    data: CreateTransactionInput,
  ): Promise<RetrieveTransaction> {
    this.validateTransactionValue(data.value);
    try {
      const transactionStatus = await this.transactionStatusRepository.create({
        name: 'PENDING',
      });
      const transactionStatusInserted =
        await this.transactionStatusRepository.save(transactionStatus);

      const transactionType = await this.transactionTypeRepository.create({
        name: data.accountExternalIdDebit,
      });
      const transactionTypeInserted = await this.transactionTypeRepository.save(
        transactionType,
      );

      const retrieveTransaction = this.transactionRepository.create({
        value: data.value,
        transactionStatus: transactionStatusInserted,
        transactionType: transactionTypeInserted,
      });

      const response = await this.transactionRepository.save(
        retrieveTransaction,
      );
      await this.sendMessageToAntiFraudService(response.transactionExternalId);

      return response;
    } catch (error) {
      throw error;
    }
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
      throw new Error('Transaction REJECTED');
    }
  }
}
