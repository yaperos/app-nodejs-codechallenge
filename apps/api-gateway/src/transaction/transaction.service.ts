import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { first } from 'rxjs/operators';
import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    console.log('Emitting transaction.create event');

    await this.transactionClient.emit(
      'transaction.create',
      JSON.stringify(createTransactionDto)
    );
    return { success: true };
  }

  async getTransactionById(id: string) {
    const transaction = await firstValueFrom(
      this.transactionClient.send('transaction.get', JSON.stringify({ id }))
    );
    return transaction;
  }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('transaction.get');
    await this.transactionClient.connect();
  }
}
