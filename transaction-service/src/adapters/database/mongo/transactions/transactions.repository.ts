import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transactions, TransactionsDocument } from './transactions.schema';
import {
  TransactionsDto,
  TransactionsUpdateDto,
} from 'src/modules/transactions/dto';
import { ITransactionsRepository } from 'src/ports/transactions/repository/transactions.interface';

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @InjectModel(Transactions.name)
    private readonly transactionsModel: Model<TransactionsDocument>,
  ) {}

  async create(transactionsDto: TransactionsDto): Promise<Transactions | null> {
    try {
      const newTransactions = await this.transactionsModel.create(
        transactionsDto,
      );

      return newTransactions;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async update(
    transactionExternalId: string,
    transactionsDto: TransactionsUpdateDto,
  ): Promise<Transactions | null> {
    try {
      await this.transactionsModel
        .updateOne({ transactionExternalId }, transactionsDto)
        .exec();

      const transactions = await this.transactionsModel
        .findOne({ transactionExternalId })
        .exec();

      return transactions;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getTransactionById(
    transactionExternalId: string,
  ): Promise<Transactions> {
    try {
      return await this.transactionsModel
        .findOne({ transactionExternalId })
        .exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getAll(): Promise<Transactions[]> {
    try {
      return await this.transactionsModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }
}
