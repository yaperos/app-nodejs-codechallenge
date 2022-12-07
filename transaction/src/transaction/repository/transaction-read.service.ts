import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Model } from "mongoose";
import { TransactionReadEntity } from "../model/mongoose/transaction-read.entity";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateTransactionMessage } from "../model/event/update-transaction-message";

@Injectable()
export class TransactionReadRepository {

  constructor(
    @InjectModel(TransactionReadEntity.name)
    private readonly transactionRead: Model<TransactionReadEntity>) {
  }

  async saveTransaction(updateTransactionMessage: UpdateTransactionMessage) {
    new this.transactionRead({
      ...updateTransactionMessage,
      createAt: updateTransactionMessage.createdAt.toString()
    }).save();
  }


  async findAll(productType: string, productId: string) {
    return await this.transactionRead.find({
      [productType]: productId
    }).exec();

  }
}
