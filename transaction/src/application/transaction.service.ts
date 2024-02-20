import { EachMessagePayload } from 'kafkajs';
import { TransactionModel, TransactionStatus } from '../domain/transaction.model';
import { KafkaClient } from '../infrastructure/kafka/kafka.client';
import logger from '../infrastructure/logger';
import { TransactionRepository } from '../infrastructure/persistence/repository/transaction.repository';
import { ITransactionEvent, ITransactionRequest, ITransactionResponse } from './transaction.interface';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private kafkaClient: KafkaClient;

  constructor(transactionRepository: TransactionRepository, kafkaClient: KafkaClient) {
    this.transactionRepository = transactionRepository;
    this.kafkaClient = kafkaClient;
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.transactionRepository.findOneById(transactionId);

    if (!transaction) {
      logger.error(`Transaction ${transactionId} not found`);
      throw new Error('Transaction not found');
    }

    const transactionResponse: ITransactionResponse = {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.getTranferType(),
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };

    return transactionResponse;
  }

  async createTransaction(body: ITransactionRequest) {
    const transaction = new TransactionModel({
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
      transferTypeId: body.transferTypeId,
      value: body.value,
    });

    await this.transactionRepository.insert(transaction);
    logger.info(`Transaction ${transaction.id} created!`);

    await this.kafkaClient.sendMessage(JSON.stringify(transaction));

    return {
      transactionExternalId: transaction.id,
      status: transaction.status,
      value: transaction.value,
    };
  }

  async updateTransactionStatus(data: string) {
    const payload: ITransactionEvent = JSON.parse(data);
    await this.transactionRepository.updateStatus(payload.transactionExternalId, payload.status as TransactionStatus);
    logger.info(`Transaction ${payload.transactionExternalId} status updated!`);
  }

  async handleUpdateStatusEvent() {
    const consumer = await this.kafkaClient.subscribeConsumerToTopic();

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const value = payload.message.value;

        if (value !== null && value !== undefined) {
          logger.info(`Message received from topic`);
          logger.info(value.toString());
          this.updateTransactionStatus(value.toString());
        }
      },
    });
  }
}
