import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ANTIFRAUD_SERVICE } from 'default/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionCreatedEvent } from './events/transaction-created.event';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createTransaction(createTransaction: CreateTransactionDto) {
    try {
      const createdTransaction = await this.transactionRepository.save(
        createTransaction,
      );
      console.log('create transactuion', createdTransaction);
      const {
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
      } = createTransaction;

      this.antifraudClient.emit(
        'transaction_created',
        JSON.stringify(createTransaction),
      );

      return createdTransaction;
    } catch (error) {
      return null;
    }
  }
}
