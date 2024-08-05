import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TransactionDocument,
  TransactionModel,
} from '../database/model/transaction.schema';
import { FilterQuery, Model } from 'mongoose';
import { ITransactionRepository } from '../../domain/repositories/itransaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionFilters } from '../../domain/filters/transaction-filters';
import { TransactionStatus } from '../../domain/entities/status.entity';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(TransactionModel.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}
  async create(transactionRegister: Transaction): Promise<string> {
    const createdTransaction = new this.transactionModel(transactionRegister);
    const result = await createdTransaction.save();
    return result.id;
  }

  async updateStatusByExternalId(
    internalId: string,
    newStatus: TransactionStatus,
  ): Promise<string> {
    const transactionEntity = await this.transactionModel
      .findOneAndUpdate(
        { transactionInternalId: internalId },
        {
          transactionStatus: {
            id: newStatus.getId(),
            name: newStatus.getName(),
          },
        },
        { new: true, useFindAndModify: false },
      )
      .exec();

    return transactionEntity.id;
  }

  async findByFilters(filters: TransactionFilters): Promise<Transaction[]> {
    const query: FilterQuery<TransactionDocument> = {};

    if (filters.transactionExternalId) {
      query.transactionExternalId = filters.transactionExternalId;
    }

    if (filters.transactionType?.name) {
      query['transactionType.name'] = filters.transactionType.name;
    }

    if (filters.transactionStatus?.name) {
      query['transactionStatus.name'] = filters.transactionStatus.name;
    }

    if (filters.value > 0) {
      query.value = filters.value;
    }

    if (filters.createdAt && filters.createdAt instanceof Date) {
      query.createdAt = { $gte: filters.createdAt };
    }

    const results = await this.transactionModel.find(query).exec();

    return results.map((doc) =>
      Transaction.reconstitute(
        doc.id,
        doc.transactionExternalId,
        doc.accountExternalIdDebit,
        doc.accountExternalIdCredit,
        doc.value,
        new TransactionStatus(
          doc.transactionStatus.id,
          doc.transactionStatus.name,
        ),
        new TransactionType(doc.transactionType.id, doc.transactionType.name),
        doc.createdAt,
        doc.updatedAt,
        doc.id,
      ),
    );
  }
}
