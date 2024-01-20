import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ANTIFRAUD_SERVICE } from 'default/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusDto } from './dto/transaction-status.dto';
/* import { TransactionCreatedEvent } from './events/transaction-created.event'; */

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudClient: ClientKafka,
  ) {}

  async getTransaction(id: string) {
    return await this.transactionRepository.findOne({
      where: {
        transactionId: id,
      },
    });
  }

  async createTransaction(createTransaction: CreateTransactionDto) {
    try {
      const createdTransaction =
        await this.transactionRepository.save(createTransaction);
      console.log('create transactuion', createdTransaction);
      const { transactionId, value } = createdTransaction;
      this.antifraudClient.emit(
        'transaction_created',
        JSON.stringify({ transactionId, value }),
      );

      return createdTransaction;
    } catch (error) {
      return null;
    }
  }

  async updateTransactionStatus(data: TransactionStatusDto) {
    let verifiedTransaction = await this.transactionRepository.findOne({
      where: { transactionId: data.transactionId },
    });
    verifiedTransaction = { ...verifiedTransaction, ...data };
    console.log(
      'updateTransactionStatus result in service',
      verifiedTransaction,
    );
    return await this.transactionRepository.save(verifiedTransaction);
  }
}
