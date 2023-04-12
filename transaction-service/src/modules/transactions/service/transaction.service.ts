import {Inject, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {transactionDocument, transactionModel, TransactionStatus} from '../schema/transaction.schema';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {transactionDTO} from '../controller/transaction.controller';
import {ClientKafka} from '@nestjs/microservices';

@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy{
  constructor(
    @InjectModel(transactionModel.name)
    private readonly transactionModel: Model<transactionDocument>,
    @Inject('TRANSACTION_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.subscribeToResponseOf('transaction.verify');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async getTransaction(transactionID: string): Promise<transactionModel> {
    return this.transactionModel.findOne({
      transactionExternalId: transactionID,
    });
  }

  async createTransaction(
    transaction: transactionDTO,
  ): Promise<transactionModel> {
    console.log('CREATE TRANSACTION_SERVICE: ', transaction)
    const { accountExternalIdDebit, accountExternalIdCredit, amount, transferTypeId } = transaction.payload;
    const transactionId = transaction.requestId;
    const isValid = await this.client.send('transaction.verify', {
      transactionExternalId: transactionId,
      transactionAmount: amount,
    });
    console.log('IS VALID: ', isValid)
    const payload = {
      transactionExternalId: transactionId,
      accountExternalIdDebit,
      accountExternalIdCredit,
      amount,
      transferTypeId,
      transactionStatus: TransactionStatus.PENDING
    }
    await this.transactionModel.create(payload);

    if (isValid) {
      return this.updateTransaction(transactionId, {
        ...payload,
        transactionStatus: TransactionStatus.COMPLETED,
      });
    }
    return this.getTransaction(transactionId);
  }

  async updateTransaction(
    transactionID: string,
    newTransaction: any,
  ): Promise<transactionModel> {
    return this.transactionModel.findOneAndUpdate(
      { transactionExternalId: transactionID },
      newTransaction,
    );
  }
}
