import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { TransactionEntity } from './transaction.entity';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { ClientKafka } from '@nestjs/microservices';
import { StatusesEnum } from 'src/transaction/domain/enum/transaction.statuses';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface
{
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    @Inject('KAFKA_CLIENT') private readonly paymentClient: ClientKafka,
  ) {}

  async create(transaction: DomainCreateTransactionDto): Promise<Transaction> {
    return await this.repository.save(transaction);
  }

  async updateStatus(id: number, status: StatusesEnum): Promise<Transaction> {
    return await this.repository.save({ id, status });
  }

  async sendCreated(transaction: Transaction) {
    try {
      await this.paymentClient.emit(
        'validate_transaction',
        JSON.stringify(transaction),
      );
    } catch (e) {
      throw new HttpException({ error: 'Falló kafka' }, 500);
    }
  }
}
