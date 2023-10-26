import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionStatus } from "../../domain/enums/transaction-status.enum";
import {
  Transaction,
  TransactionDocument,
} from "../schemas/transaction.schema";

@Injectable()
export class MongooseRepository implements TransactionRepository {
  constructor(
    @InjectModel(Transaction.name)
    private transacionModel: Model<TransactionDocument>,
  ) {}

  async save(transaction: any): Promise<any> {
    return await new this.transacionModel(transaction).save();
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.transacionModel.updateOne({ id }, { status });
  }

  async findOne(id: string): Promise<any> {
    return await this.transacionModel.findOne({ id });
  }
}
