import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransaction, CreateTransferType, GetTransaction, TransactionM, TransactionStatuses, TransferType, UpdateTransaction, UpdateTransferType } from '@app/common/domain/model/transaction.model';
import { v4 as uuidv4 } from 'uuid'
import config from '../../../../../../config';
import { ConfigType } from '@nestjs/config';
import { KafkaClientService } from '@app/kafka-client'
import { KafkaTransaction } from '@app/common/domain/model/kafka.model';
import { Model } from 'mongoose';
import { Transaction } from '../../../infrastructure/adapters/database/entities/transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Transfertype } from '../../../infrastructure/adapters/database/entities/transferType.entity';

@Injectable()
export class ApiTransactionService {
  private topicTransactions: string;
  constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
    private kafkaService: KafkaClientService,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Transfertype.name) private transferTypeModel: Model<Transfertype>,
  ) {
    this.topicTransactions = this.configService.KAFKA_TRANSACTIONS_TOPIC;
  }

  async CreateTransaction(
    requestBody: CreateTransaction
  ): Promise<TransactionM> {
    const isValidTransferType = await this.validateTransferType(requestBody.tranferTypeId);
    if(!isValidTransferType){
      throw new BadRequestException('TransferType not found. Create a transfer type is required before creating a transaction')
    }
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

    await this.kafkaService.sendMessage(this.topicTransactions, id, newTransaction)
    return newTransaction;
  }

  async findAll() {
    const transactions = await this.transactionModel.find().exec();

    return transactions
  }

  async findOne(id: string) {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    const transactionTypeData = await this.findOneTransferType(transaction.tranferTypeId);
    const transactionResponse: GetTransaction = {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transactionTypeData.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus
      },
      value: transaction.value,
      created_at: transaction.created_at,
    }
    return transactionResponse
  }

  async update(id: string, updateApiTransactionDto: UpdateTransaction) {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, { $set: updateApiTransactionDto }, { new: true })
      .exec()
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return updatedTransaction
  }

  async updateTransaction(messageObject: any) {
    const ValidatedTransaction: Partial<KafkaTransaction> = messageObject;
    const id = ValidatedTransaction._id;
    const updateObject: UpdateTransaction = {
      "transactionStatus": ValidatedTransaction.transactionStatus
    }
    const updatedTransaction = this.update(id, updateObject)
    return updatedTransaction
  }

  async remove(id: string) {
    const deletedTtransaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec()
    if (!deletedTtransaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return deletedTtransaction
  }

  //TransferTypes
  async createTransferType(
    requestBody: CreateTransferType
  ): Promise<TransferType> {
    const isValidTransferType = await this.validateTransferType(requestBody.transferTypeId);
    if(isValidTransferType){
      throw new BadRequestException('TransferType already exists')
    }
    const newTransferTypeMongo = await this.transferTypeModel.create({
      "tranferTypeId": requestBody.transferTypeId,
      "name": requestBody.name,
      "created_at": new Date()
    });
    return {
      "_id": newTransferTypeMongo._id.toString(),
      "transferTypeId": newTransferTypeMongo.tranferTypeId,
      "name": newTransferTypeMongo.name,
      "created_at": newTransferTypeMongo.created_at
    };
  }
  
  async validateTransferType(transferTypeId: number){
    try{
      const transferType = await this.findOneTransferType(transferTypeId)
      console.log({transferType})
      if(transferType) return true
    }catch(error){
      return false
    }
    return false
  }

  findAllTransferTypes() {
    return this.transferTypeModel.find().exec();
  }

  async findOneTransferType(id: number) {
    const transferType = await this.transferTypeModel.findOne({tranferTypeId: id}).exec();
    if (!transferType) {
      throw new NotFoundException(`Transfer type ${id} not found`);
    }
    return transferType
  }

  async updateTransferType(id: number, updatedTransferTypeDto: UpdateTransferType) {
    const updatedTransferType = await this.transferTypeModel
      .updateOne({tranferTypeId: id}, { $set: updatedTransferTypeDto })
      .exec()
    if (!updatedTransferType) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return updatedTransferType
  }

  async removeTransferType(id: number) {
    const deletedTransferType = await this.transferTypeModel
      .deleteOne({tranferTypeId: id})
      .exec()
    if (!deletedTransferType) {
      throw new NotFoundException(`TransferType ${id} not found`);
    }
    return deletedTransferType
  }
}
