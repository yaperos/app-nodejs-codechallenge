import { DataSource, Repository } from 'typeorm';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import {
  CcreateTransactionResult,
  FindTransactionResult,
  TransactionRepository,
  UpdateTransactionResult,
} from '../../domain/repositories/transaction.repository';
import { TransactionModel } from '../models/transaction.model';
import { Injectable, Logger } from '@nestjs/common';
import { err, ok } from 'neverthrow';
import {
  TransactionCreateException,
  TransactionFindException,
  TransactionUpdateException,
} from '../../domain/exceptions/transaction.exception';

@Injectable()
export class DBTransactionRespository
  extends Repository<TransactionModel>
  implements TransactionRepository
{
  private readonly logger: Logger = new Logger(DBTransactionRespository.name);

  constructor(private dataSource: DataSource) {
    super(TransactionModel, dataSource.createEntityManager());
  }

  async createTransaction(
    transaction: TransactionEntity,
  ): Promise<CcreateTransactionResult> {
    try {
      const transactionModel = TransactionModel.fromEntity(transaction);
      await this.save(transactionModel);
      return ok(null);
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransactionCreateException(error.message));
    }
  }

  async updateTransaction(
    transaction: TransactionEntity,
  ): Promise<UpdateTransactionResult> {
    try {
      const transactionModel = TransactionModel.fromEntity(transaction);
      await this.save(transactionModel);
      return ok(null);
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransactionUpdateException(error.message));
    }
  }

  async findTransaction(transactionId: string): Promise<FindTransactionResult> {
    try {
      const transaction = await this.findOne({
        where: {
          transactionExternalId: transactionId,
        },
        relations: {
          transferType: true,
        },
      });

      if (!transaction) {
        return err(new TransactionFindException(`not found ${transactionId}`));
      }
      return ok(transaction.toEntity());
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransactionFindException(error.message));
    }
  }
}
