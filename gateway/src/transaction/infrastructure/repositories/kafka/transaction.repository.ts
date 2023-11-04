import { HttpException, Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface
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
}
