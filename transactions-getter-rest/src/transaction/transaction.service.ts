import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Account } from 'src/entities/account.entity';
import { TransactionOutput, TransactionsOutput } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  private kafka;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionModel: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountModel: Repository<Account>,
  ) {}

  async getTransaction(transactionId: string): Promise<TransactionOutput> {
    const foundTransaction = await this.transactionModel.findOne({
      where: { id: transactionId },
    });
    if (!foundTransaction) {
      throw new NotFoundException('transaction not found');
    }
    const response = {
      transactionExternalId: foundTransaction.id,
      transactionType: foundTransaction.transfer_type_id,
      transactionStatus: {
        name: foundTransaction.status,
      },
      value: foundTransaction.value,
      createdAt: foundTransaction.created_at,
    };
    return response;
  }

  async getTransactions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<TransactionsOutput> {
    const [transactions, totalCount] = await this.transactionModel.findAndCount(
      {
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: ['id', 'created_at', 'transfer_type_id', 'value', 'status'],
      },
    );

    const formattedTransactions = transactions.map((transaction) => ({
      transactionExternalId: transaction.id,
      transactionType: transaction.transfer_type_id,
      transactionStatus: { name: transaction.status },
      value: transaction.value,
      createdAt: transaction.created_at,
    }));

    return {
      totalCount,
      transactions: formattedTransactions,
    };
  }
}
