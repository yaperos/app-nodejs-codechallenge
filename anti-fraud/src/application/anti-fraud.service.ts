import { EachMessagePayload } from 'kafkajs';
import { TransactionStatus, TransactionValidationModel } from '../domain/transaction-validation';
import { KafkaClient } from '../infrastructure/kafka/kafka.client';
import logger from '../infrastructure/logger';
import { IAntiFraudEvent, IAntiFraudRequest } from './anti-fraud.interface';

export class AntiFraudService {
  private kafkaClient: KafkaClient;

  constructor(kafkaClient: KafkaClient) {
    this.kafkaClient = kafkaClient;
  }

  public validateTransaction(payload: string): string {
    const transactionRequest: IAntiFraudRequest = JSON.parse(payload);

    const transaction = new TransactionValidationModel({
      id: transactionRequest.id,
      transferTypeId: transactionRequest.transferTypeId,
      value: transactionRequest.value,
      status: transactionRequest.status as TransactionStatus,
      accountExternalIdDebit: transactionRequest.accountExternalIdDebit,
      accountExternalIdCredit: transactionRequest.accountExternalIdCredit,
      createdAt: transactionRequest.createdAt,
    });

    transaction.setTransactionStatusByAmount();
    logger.info(`Transaction ${transaction.id} updated to ${transaction.status} status`);

    const transactionResponse: IAntiFraudEvent = {
      transactionExternalId: transaction.id,
      value: transaction.value,
      status: transaction.status,
    };

    return JSON.stringify(transactionResponse);
  }

  public async handleValidateValueEvent() {
    const consumer = await this.kafkaClient.subscribeConsumerToTopic();

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const value = payload.message.value;

        if (value !== null && value !== undefined) {
          logger.info(`Message received from topic`);
          logger.info(value.toString());

          const response = this.validateTransaction(value.toString());
          this.kafkaClient.sendMessage(response);
        }
      },
    });
  }
}
