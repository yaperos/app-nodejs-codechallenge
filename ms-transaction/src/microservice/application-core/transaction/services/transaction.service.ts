import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repositories';
import { CreateTransactionInput } from '../dtos/inputs';
import { TransactionCreateModel, TransactionModel } from '../models';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '../dtos/enums/index';
import { Producer } from 'kafkajs';
import { TransactionResponseDB } from '../dtos';
import { Cache } from 'cache-manager';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('KAFKA_PRODUCER')
    private kafkaProducer: Producer,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private transactionRepository: TransactionRepository,
  ) {}

  async getTransactionById(id: string): Promise<TransactionModel> {
    try {
      const cache = await this.cacheService.get<any>(id);
      if (cache) {
        return {
          transactionExternalId: cache.id,
          transactionStatus: {
            name: TransactionStatusEnum[
              cache.transactionStatusId
            ].toLowerCase(),
          },
          transactionType: {
            name: TransactionTypeEnum[cache.transactionTypeId].toLowerCase(),
          },
          value: cache.value,
          createdAt: new Date(cache.createdAt),
        } as TransactionModel;
      }

      const respRaw = await this.transactionRepository.getByIdRaw(id);

      if (!respRaw[0]) {
        throw new Error('Transaction not found');
      }

      const transRaw = respRaw[0] as TransactionResponseDB;

      const transactionResponse = this.getTransactionResponse(transRaw);

      return transactionResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private getTransactionResponse(
    transaction: TransactionResponseDB,
  ): TransactionModel {
    return {
      transactionExternalId: transaction.id,
      transactionType: { name: transaction.transactionType },
      transactionStatus: { name: transaction.transactionStatus },
      value: transaction.value,
      createdAt: transaction.createdAt,
    } as TransactionModel;
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

      await this.cacheService.set(transaction.id, transaction);

      const { id, version, ...transactionData } = transaction;

      const transactionResponse = {
        ...transactionData,
        transactionExternalId: id,
      } as TransactionCreateModel;

      const eventMessage = {
        value: transactionData.value,
        transactionExternalId: id,
      };

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

      await this.cacheService.del(id);
      transaction.transactionStatusId = status;
      await this.cacheService.set(transaction.id, transaction);

      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
