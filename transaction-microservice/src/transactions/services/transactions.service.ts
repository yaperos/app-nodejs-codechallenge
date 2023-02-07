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

    console.log(
      'transactionValidation',
      response_save.transactionId,
      response_save.value,
    );

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

  async update(id: any, body: any) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        transactionId: id,
      },
    });
    this.transactionRepo.merge(transaction, body);
    return this.transactionRepo.save(transaction);
  }

  async emitTransaction(response_save: any) {
    const transactionId = response_save.transactionId;
    const transactionAmount = response_save.value;

    this.client.emit('transaction.validate', {
      transactionId,
      transactionAmount,
    });
  }
}
