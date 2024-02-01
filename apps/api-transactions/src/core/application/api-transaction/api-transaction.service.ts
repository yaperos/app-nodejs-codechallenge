import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransaction, TransactionM, TransactionStatuses, UpdateTransaction } from '@app/common/domain/model/transaction.model';
import { v4 as uuidv4 } from 'uuid'
import config from '../../../../../../config';
import { ConfigType } from '@nestjs/config';
import { KafkaClientService } from '@app/kafka-client'
import { KafkaTransaction } from '@app/common/domain/model/kafka.model';
import mongoose, { Model } from 'mongoose';
import { Transaction } from '../../../infrastructure/adapters/database/entities/transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import { KafkaMessage } from 'kafkajs';

@Injectable()
export class ApiTransactionService {
  private topicTransactions: string;
  constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
    private kafkaService: KafkaClientService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {
    this.topicTransactions = this.configService.KAFKA_TRANSACTIONS_TOPIC;
  }

  async CreateTransaction(
    requestBody: CreateTransaction
  ): Promise<TransactionM> {
    const accountExternalIdCredit = uuidv4();
    const accountExternalIdDebit = uuidv4();
    const newTransactionMongo = await this.transactionModel.create({
      "accountExternalIdCredit": accountExternalIdCredit,
      "accountExternalIdDebit": accountExternalIdDebit,
      "tranferTypeId": requestBody.tranferTypeId,
      "value": requestBody.value,
      "created_at": new Date(),
      "transactionStatus": TransactionStatuses.PENDING
    });
    const id = newTransactionMongo._id.toString();
    const newTransaction: TransactionM = {
      "_id": id,
      "accountExternalIdCredit": newTransactionMongo.accountExternalIdCredit,
      "accountExternalIdDebit": newTransactionMongo.accountExternalIdDebit,
      "tranferTypeId": newTransactionMongo.tranferTypeId,
      "value": newTransactionMongo.value,
      "created_at": newTransactionMongo.created_at,
      "transactionStatus": newTransactionMongo.transactionStatus
    }

    await this.kafkaService.sendMessage(this.topicTransactions, id , newTransaction)
    return newTransaction;
  }

  findAll() {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string) {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction
  }

  async update(id: string, updateApiTransactionDto: UpdateTransaction) {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, { $set: updateApiTransactionDto} , {new: true})
      .exec()
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return updatedTransaction
  }

  async updateTransaction(messageObject: any) {
    const ValidatedTransaction: Partial<KafkaTransaction> = messageObject;
    const id =  ValidatedTransaction._id;
    const updateObject: UpdateTransaction = {
      "transactionStatus" : ValidatedTransaction.transactionStatus
    }
    const updatedTransaction = this.update(id, updateObject)
    return updatedTransaction
  }

  remove(id: number) {
    return `This action removes a #${id} apiTransaction`;
  }
}
