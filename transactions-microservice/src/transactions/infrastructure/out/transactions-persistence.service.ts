import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionPrimitives } from 'src/transactions/domain/Transaction';
import { TransactionId } from 'src/transactions/domain/TransactionId';
import { TransactionRepository } from 'src/transactions/domain/TransactionRepository';
import { TransactionStatus } from 'src/transactions/domain/TransactionStatus';
import { TransactionModel, TransactionModelDocument } from 'src/transactions/infrastructure/out/transaction.model';
import { ErrorMessages } from 'src/utils/constants';

@Injectable()
export class TransactionsPersistenceService implements TransactionRepository {
  constructor(
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionModelDocument>,
  ) {}
  async createTransaction(transaction: Transaction): Promise<TransactionPrimitives> {
    try {
      const { _id, ...rest } = (await this.transactionModel.create(transaction.toPrimitives())).toJSON();
      return rest;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
  async updateTransactionStatus(id: TransactionId, status: TransactionStatus): Promise<TransactionPrimitives> {
    try {
      const res = (
        await this.transactionModel.findOneAndUpdate(
          { uuid: id.value },
          { transactionStatus: { name: status.name } },
          { new: true },
        )
      ).toJSON();
      return res;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
  async getTransaction(id: TransactionId): Promise<TransactionPrimitives> {
    try {
      const res = await this.transactionModel.findOne({ uuid: id.value });
      return res;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
}
