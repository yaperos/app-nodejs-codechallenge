import { HttpException, Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { ClientKafka } from '@nestjs/microservices';
import { GraphQLClient } from 'graphql-request';
import {
  mutationApproved,
  mutationCreate,
  mutationRejected,
  queryGetOne,
} from './graphql.queries';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface
{
  private readonly server: string;

  constructor(
    @Inject('KAFKA_CLIENT') private readonly paymentClient: ClientKafka,
    private readonly configService: ConfigService,
  ) {
    this.server = this.configService.get<string>('GRAPHQL_SERVER');
  }

  async create(transaction: DomainCreateTransactionDto): Promise<Transaction> {
    const query = mutationCreate();
    const data = await this.sendGraphQL(query, transaction);
    return (data as { createTransaction: Transaction }).createTransaction;
  }

  async reject(id: number): Promise<Transaction> {
    const query = mutationRejected();
    const data = await this.sendGraphQL(query, { id });
    return (data as { rejectTransaction: Transaction }).rejectTransaction;
  }
  async approve(id: number): Promise<Transaction> {
    const query = mutationApproved();
    const data = await this.sendGraphQL(query, { id });
    return (data as { approveTransaction: Transaction }).approveTransaction;
  }

  async getById(id: number): Promise<Transaction> {
    const query = queryGetOne(id);
    const data = await this.sendGraphQL(query);
    return (data as { transaction: Transaction }).transaction;
  }

  async sendGraphQL(query: string, variables?: any) {
    try {
      const client = new GraphQLClient(this.server);
      const response = await client.request(query, variables);
      return response;
    } catch (e) {
      throw new HttpException(
        e?.response
          ? JSON.stringify(e?.response?.errors || {}, null, 2)
          : e.message,
        500,
      );
    }
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
