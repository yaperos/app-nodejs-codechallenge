import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface, OnModuleInit
{
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async create(transaction: DomainCreateTransactionDto) {
    try {
      await this.kafkaClient.emit(
        'process_transaction',
        JSON.stringify(transaction),
      );
    } catch (e) {
      throw new HttpException({ error: 'Falló kafka' }, 500);
    }
  }
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('get_transaction_by_id');
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async getById(id: number): Promise<Transaction> {
    console.log(id);
    try {
      const response = await lastValueFrom(
        this.kafkaClient.send('get_transaction_by_id', JSON.stringify({ id })),
      );
      console.log('response=', response, response.status, response.message);
      if (response.status == 200) {
        return response.message as Transaction;
      }
      throw new HttpException({ error: 'No se encontró el registro' }, 404);
    } catch (e) {
      throw new HttpException({ error: 'Falló kafka' }, 500);
    }
  }
}
