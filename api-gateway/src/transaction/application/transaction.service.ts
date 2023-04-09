import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from '../domain/requests/create-transaction.dto';
import { TransactionDto } from '../domain/responses/transaction.dto';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @Inject('TRANSACTION-MICROSERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  create(params: CreateTransactionDto): void {
    this.transactionClient.emit('create_transaction', JSON.stringify(params));
  }

  async getAll(): Promise<TransactionDto[]> {
    let transactions = [];

    const response = this.transactionClient.send('get_transactions', {});

    transactions = await lastValueFrom(response);

    return plainToInstance(TransactionDto, transactions);
  }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('get_transactions');
    await this.transactionClient.connect();
  }
}
