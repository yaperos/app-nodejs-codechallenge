import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories';
import { CreateTransactionInput } from '../dtos/inputs';
import { TransactionCreateModel, TransactionModel } from '../models';
import { TransactionStatusEnum } from '../dtos/enums/index';
import { Producer } from 'kafkajs';
import { TransactionResponseDB } from '../dtos';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
    private transactionRepository: TransactionRepository,
  ) {}

  async getTransactionById(id: string): Promise<TransactionModel> {
    try {
      const respRaw = await this.transactionRepository.getByIdRaw(id);

      if (!respRaw[0]) {
        throw new Error('Transaction not found');
      }

      const transRaw = respRaw[0] as TransactionResponseDB;

      const transactionResponse = {
        transactionExternalId: transRaw.transactionExternalId,
        transactionType: { name: transRaw.transactionType },
        transactionStatus: { name: transRaw.transactionStatus },
        value: transRaw.value,
        createdAt: transRaw.createdAt,
      } as TransactionModel;

      return transactionResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createTransaction(
    data: CreateTransactionInput,
  ): Promise<TransactionCreateModel> {
    try {
      const payload = {
        ...data,
        transactionStatusId: TransactionStatusEnum.PENDING,
      };

      const transaction = await this.transactionRepository.create(payload);
      if (!transaction) {
        throw new Error('Transaction not created');
      }
      const { id, version, ...transactionData } = transaction;

      const transactionResponse = {
        ...transactionData,
        transactionExternalId: id,
      } as TransactionCreateModel;

      const eventMessage = {
        value: transactionData.value,
        transactionExternalId: id,
      };
      console.log('dataMsg', JSON.stringify(eventMessage, null, 3));

      await this.kafkaProducer.send({
        topic: 'created_transaction',
        messages: [
          { key: 'validation_anti_fraud', value: JSON.stringify(eventMessage) },
        ],
      });

      return transactionResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateStatus(
    id: string,
    status: TransactionStatusEnum,
  ): Promise<boolean> {
    try {
      const transaction = await this.transactionRepository.getById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const transactionResp = await this.transactionRepository.updateOcc(
        id,
        transaction.version,
        {
          transactionStatusId: status,
        },
      );
      if (!transactionResp.count) {
        throw new Error('Transaction not updated');
      }
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
