import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Kafka, Producer } from 'kafkajs';
import { Model } from 'mongoose';
import { ISecondaryPort } from 'src/transactions/application/ports/secondary/ITransactionSecondaryPort';
import { TransactionDTO } from 'src/transactions/domain/dtos/transactionDto';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/domain/entities/transaction';

@Injectable()
export class TransactionSecondaryAdapter implements ISecondaryPort {
  private kafka: Kafka;
  private producer: Producer;
  private logger = new Logger('SecondaryAdapter');
  constructor(
    @InjectModel('Transaction')
    private readonly transactionModel: Model<TransactionDocument>,
  ) {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['kafka:9092'],
    });
    this.transactionModel = transactionModel;
    this.producer = this.kafka.producer();
  }
  async createTransaction(dto: TransactionDTO): Promise<Transaction> {
    const createdTransaction = await this.transactionModel.create(dto);
    return createdTransaction.toObject();
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({
      $or: [
        { accountExternalIdDebit: transactionId },
        { accountExternalIdCredit: transactionId },
      ],
    });
    return transaction?.toObject();
  }

  async updateTransactionStatus(
    transactionId: string,
    status: string,
  ): Promise<void> {
    await this.transactionModel.updateOne(
      {
        _id: transactionId,
      },
      { $set: { status } },
    );
  }

  async updateTransactionStatusQueue(
    transactionId: string,
    status: string,
  ): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'transaction-status-updates',
        messages: [{ key: transactionId, value: status }],
      });
      this.logger.log(
        `Transaction ${transactionId} status updated to ${status}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update transaction ${transactionId} status: ${error}`,
      );
    } finally {
      await this.producer.disconnect();
    }
  }
}
