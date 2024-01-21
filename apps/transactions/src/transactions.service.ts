import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ANTIFRAUD_SERVICE } from 'default/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatusDto } from './dto/transaction-status.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudClient: ClientKafka,
  ) {}

  public async getTransaction(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: { name: transaction.transferTypeId },
      transactionStatus: { name: transaction.status },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }

  public async createTransaction(
    createTransaction: CreateTransactionDto,
  ): Promise<Transaction> {
    try {
      const createdTransaction =
        await this.transactionRepository.save(createTransaction);
      const { transactionExternalId, value } = createdTransaction;
      this.antifraudClient.emit(
        'transaction_created',
        JSON.stringify({ transactionExternalId, value }),
      );

      return createdTransaction;
    } catch (error) {
      return null;
    }
  }

  public async updateTransactionStatus(
    data: TransactionStatusDto,
  ): Promise<Transaction> {
    let verifiedTransaction = await this.transactionRepository.findOne({
      where: { transactionExternalId: data.transactionExternalId },
    });
    verifiedTransaction = { ...verifiedTransaction, ...data };
    return await this.transactionRepository.save(verifiedTransaction);
  }
}
