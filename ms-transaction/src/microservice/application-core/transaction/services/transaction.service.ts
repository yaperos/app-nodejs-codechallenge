import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionRepository } from '../repositories';
import { CreateTransactionInput } from '../dtos/inputs';
import { TransactionModel } from '../models';
import { TransactionStatusEnum } from '../dtos/enums/index';
import { ClientKafka } from '@nestjs/microservices';
import { first } from 'rxjs';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly clientKafka: ClientKafka,
    private transactionRepository: TransactionRepository,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('anti_fraud');
    await this.clientKafka.connect();
  }

  async OnModuleDestroy() {
    await this.clientKafka.close();
  }

  async getTransactionById(id: string): Promise<TransactionModel> {
    try {
      const transaction = await this.transactionRepository.getById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const transactionResponse = {
        transactionExternalId: transaction.id,
        transactionType: { name: transaction.transactionType.name },
        transactionStatus: { name: transaction.transactionStatus.name },
        value: transaction.value,
        createdAt: transaction.createdAt,
      } as TransactionModel;

      return transactionResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createTransaction(
    data: CreateTransactionInput,
  ): Promise<TransactionModel> {
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
      } as TransactionModel;

      const dataMsg = {
        value: { value: transactionData.value, transactionExternalId: id },
      };
      console.log('dataMsg', JSON.stringify(dataMsg, null, 3));
      this.clientKafka
        .send('anti_fraud', dataMsg)
        .pipe(first())
        .subscribe((response: any) => {
          console.log('response', JSON.stringify(response, null, 3));
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
