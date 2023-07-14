import { Injectable, Logger } from '@nestjs/common';
import {
  CcreateTransactionResult,
  FindTransactionResult,
  TransactionRepository,
  UpdateTransactionResult,
} from '../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { Model } from 'mongoose';
import { err, ok } from 'neverthrow';
import {
  TransactionCreateException,
  TransactionFindException,
  TransactionUpdateException,
} from '../../domain/exceptions/transaction.exception';

@Injectable()
export class DocumentTransactionRepository implements TransactionRepository {
  private readonly logger: Logger = new Logger(
    DocumentTransactionRepository.name,
  );

  constructor(
    @InjectModel(Transaction.name)
    private readonly model: Model<TransactionDocument>,
  ) {}

  async createTransaction(
    transaction: TransactionEntity,
  ): Promise<CcreateTransactionResult> {
    try {
      await this.model.create(transaction.toJSON());
      this.logger.log(JSON.stringify(transaction.toJSON()));
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
      await this.model.updateOne(
        { transactionExternalId: transaction.transactionExternalId },
        transaction.toJSON(),
      );
      this.logger.log(JSON.stringify(transaction.toJSON()));
      return ok(null);
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransactionUpdateException(error.message));
    }
  }

  async findTransaction(transactionId: string): Promise<FindTransactionResult> {
    try {
      const transaction = await this.model
        .findOne({ transactionExternalId: transactionId })
        .exec();
      if (!transaction) {
        return err(new TransactionFindException(`not found ${transactionId}`));
      }
      return ok(
        TransactionEntity.createFromString(
          JSON.stringify(transaction.toJSON()),
        ),
      );
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransactionFindException(error.message));
    }
  }
}
