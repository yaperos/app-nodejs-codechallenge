import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionRequest } from './dto/create-transaction.request';
import { TransactionEvent } from './dto/transaction-event.response';
import { Transaction } from '../domain/entities/transaction';
import { UpdateTransactionRequest } from './dto/update-transaction.request';
import { topicTypes, transactionStatus } from '../shared/constants';
import { IProducer } from '../domain/stream/producer.interface';
import { IConsumer } from '../domain/stream/consumer.interface';
import { PrismaInfrastructure } from '../infrastructure/database/prisma.infrastructure';
@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaInfrastructure,
    @Inject('IProducer') private readonly producer: IProducer,
    @Inject('IConsumer') private readonly consumer: IConsumer,
  ) {}

  async onModuleInit() {
    await this.consumer.consume(
      {
        topics: [
          topicTypes.transactionRejected,
          topicTypes.transactionApproved,
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const eventParsed: TransactionEvent = JSON.parse(
            message.value!.toString(),
          );
          await this.updateTransaction(eventParsed);
        },
      },
    );
  }

  async getTransaction(
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
  ): Promise<TransactionEvent> {
    try {
      const response = await this.prisma.transaction.findUnique({
        where: {
          accountExternalIdDebit: accountExternalIdDebit,
          accountExternalIdCredit: accountExternalIdCredit,
        },
      });
      return JSON.parse(response!.data);
    } catch (e) {
      throw new Error('Error getting transaction');
    }
  }

  async createTransaction(
    transactionData: CreateTransactionRequest,
  ): Promise<TransactionEvent> {
    try {
      const transactionEvent = this.buildEvent(transactionData);
      const transactionObject = new Transaction();
      transactionObject.accountExternalIdCredit =
        transactionData.accountExternalIdCredit;
      transactionObject.accountExternalIdDebit =
        transactionData.accountExternalIdDebit;
      transactionObject.data = JSON.stringify(transactionEvent);
      const transactionEventCopy = {
        accountExternalIdCredit: transactionData.accountExternalIdCredit,
        accountExternalIdDebit: transactionData.accountExternalIdDebit,
        ...transactionEvent,
      };
      await this.publishTransaction(transactionEventCopy);
      const response = await this.prisma.transaction.create({
        data: transactionObject,
      });
      return JSON.parse(response.data);
    } catch (e) {
      throw new Error('Error creating transaction');
    }
  }

  async updateTransaction(
    transactionData: UpdateTransactionRequest,
  ): Promise<Transaction> {
    try {
      const transactionDataCopy = {
        ...transactionData,
      };
      delete transactionDataCopy.accountExternalIdCredit;
      delete transactionDataCopy.accountExternalIdDebit;
      return await this.prisma.transaction.update({
        where: {
          accountExternalIdDebit: transactionData.accountExternalIdDebit,
          accountExternalIdCredit: transactionData.accountExternalIdCredit,
        },
        data: { data: JSON.stringify(transactionDataCopy) },
      });
    } catch (e) {
      throw new Error('Error updating transaction');
    }
  }

  private async publishTransaction(data: TransactionEvent) {
    await this.producer.produce({
      topic: topicTypes.transactionPending,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
  }

  private buildEvent(
    transactionData: CreateTransactionRequest,
  ): TransactionEvent {
    const transactionEvent = {
      transactionExternalId: uuidv4(),
      transactionType: {
        name: String(transactionData.tranferTypeId),
      },
      transactionStatus: {
        name: transactionStatus.pending,
      },
      value: transactionData.value,
      createdAt: new Date(),
    };
    return transactionEvent;
  }
}
