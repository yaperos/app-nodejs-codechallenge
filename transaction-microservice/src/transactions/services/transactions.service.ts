import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '../entities/transaction.entity';
import {
  ClientKafka,
  ClientProxy,
  Ctx,
  KafkaContext,
  MessagePattern,
} from '@nestjs/microservices';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Consumer } from '@nestjs/microservices/external/kafka.interface';
import { TransactionCreatedEvent } from '../events/transaction.create.event';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,

    @Inject('TRANSACTIONSERVICE')
    private readonly client: ClientProxy,
  ) {}

  // async onModuleInit() {
  //   this.client.subscribeToResponseOf('transaction.validate');
  //   await this.client.connect();
  // }

  async creategraphql(
    transaction: CreateTransactionInput,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepo.create(transaction);
    newTransaction.transactionStatus = 'pending';
    const response_save = await this.transactionRepo.save(newTransaction);
    this.emitTransaction(response_save);

    return response_save;
  }

  async create(body: CreateTransactionInput) {
    const newTransaction = this.transactionRepo.create(body);
    newTransaction.transactionStatus = 'pending';
    const response_save = await this.transactionRepo.save(newTransaction);

    this.emitTransaction(response_save);

    return response_save;
  }

  async getOne(id: string) {
    const transaction_value = await this.transactionRepo.findOne({
      where: {
        transactionId: id,
      },
    });

    const Response = {
      transactionExternalId: transaction_value.transactionId,
      transactionType: {
        name: 'Test',
      },
      transactionStatus: {
        name: transaction_value.transactionStatus,
      },
      value: transaction_value.value,
      createdAt: transaction_value.createdAt,
    };

    return Response;
  }

  async update(id: string, status: string) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        transactionId: id,
      },
    });
    transaction.transactionStatus = status;
    return await this.transactionRepo.save(transaction);
  }

  async emitTransaction(response_save: any) {
    this.client
      .send('transaction.validate', {
        transactionId: response_save.transactionId,
        transactionAmount: response_save.value,
      })
      .subscribe((transactionReturn) => {
        this.update(
          transactionReturn.transactionId,
          transactionReturn.transactionStatus,
        );
        console.log('Transaction updated successfullsady', transactionReturn);
      });
  }
}
