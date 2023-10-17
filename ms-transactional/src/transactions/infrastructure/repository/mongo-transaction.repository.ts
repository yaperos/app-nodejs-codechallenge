import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/entity/transaction';
import { TransactionRepository } from 'src/transactions/domain/repository/transaction.repository';
import { MongoTransaction } from '../entity/mongo-transaction';
import { Model } from 'mongoose';

export class MongoTransactionRepository implements TransactionRepository {
  public constructor(
    @InjectModel(MongoTransaction.name)
    private readonly mongoTransactionModel: Model<MongoTransaction>,
  ) {}

  public async createTransaction(
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    return await this.mongoTransactionModel.create(transaction);
  }

  public async findTransaction(
    transactionId: string,
  ): Promise<Transaction | null> {
    return await this.mongoTransactionModel.findOne({ transactionId });
  }

  public async updateTransaction(
    transactionId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    const transactionUpdated =
      await this.mongoTransactionModel.findOneAndUpdate(
        { transactionId },
        transaction,
        { new: true },
      );

    if (!transactionUpdated) throw new Error('Transaction not found');

    return transactionUpdated;
  }

  public async findLastTransactionByAccountExternalIdDebit(
    accountExternalIdDebit: string,
  ): Promise<Transaction | null> {
    return await this.mongoTransactionModel.findOne(
      {
        accountExternalIdDebit,
        status: TransactionStatus.APPROVED,
      },
      {},
      { sort: { createdAt: -1 } },
    );
  }
}
