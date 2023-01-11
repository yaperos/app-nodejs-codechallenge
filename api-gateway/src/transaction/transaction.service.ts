import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const statusTransaction = await new Promise((resolve) => {
      this.transactionClient
        .send<any>('transaction_created', { transaction: createTransactionDto })
        .subscribe((result) => {
          resolve(result);
        });
    });
    return statusTransaction;
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
}
