import { TransactionRepository } from '../contracts/transactionRepository';
import TransactionModel from '../models/transactionModel';
import logger from '../libs/logger';
import { TRANSACTION_CREDIT_TYPE, TRANSACTION_DEBIT_TYPE } from '../constants/transaction';
import { getTransactionStatus } from '../helpers/utils';

export class TransactionMongoRepository implements TransactionRepository {
  constructor() {}

  async create(transaction: any): Promise<any> {
    logger.info(`Creating transaction ${transaction.id} on Mongo`);

    const transactionModel = new TransactionModel({
      id: transaction.id,
      transactionExternalId: transaction.accountExternalIdDebit || transaction.accountExternalIdCredit,
      transactionType: {
        name: transaction.accountExternalIdDebit ? TRANSACTION_DEBIT_TYPE : TRANSACTION_CREDIT_TYPE,
      },
      transactionStatus: getTransactionStatus(transaction.statusId),
      value: transaction.value,
    });
    return transactionModel.save();
  }

  async update(id: string, transaction: any): Promise<any> {
    logger.info(`Updating transaction ${transaction.id} on Mongo`);
    const transactionModel = await TransactionModel.findOne({
      id: id,
    });
    transactionModel.transactionStatus = getTransactionStatus(transaction.statusId);
    return transactionModel.save();
  }

  async findById(id: string): Promise<any> {
    return TransactionModel.findOne({ id: id }).select('-_id -__v');
  }
}
