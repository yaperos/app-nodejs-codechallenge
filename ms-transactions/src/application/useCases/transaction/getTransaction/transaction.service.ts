import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from '../../../../infraestructure/database/models/transactions';
import { Repository } from 'typeorm';
import { DbError } from '../../../errors/database.error';
import {
  TRANSACTION_STATUS_ID,
  TRANSACTION_TYPE_ID,
} from 'src/application/constant';
import { TransactionFilterInput } from 'src/domain/transaction/transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,
  ) {}

  async getTransaction(query: TransactionFilterInput) {
    try {
      const whereClause: any = {};

      if (query.transactionExternalId) {
        whereClause.transactionExternalId = query.transactionExternalId;
      }
      if (query.transactionType) {
        whereClause.type =
          TRANSACTION_TYPE_ID[query.transactionType.name.toUpperCase()];
      }
      if (query.transactionStatus) {
        whereClause.status =
          TRANSACTION_STATUS_ID[query.transactionStatus.name.toUpperCase()];
      }
      if (query.value) {
        whereClause.value = query.value;
      }
      if (query.createdAt) {
        whereClause.createdAt = new Date(query.createdAt);
      }

      console.log(whereClause);

      return await this.transactionRepository.find({ where: whereClause });
    } catch (error) {
      throw new DbError(error, 'createTransaction');
    }
  }
}
