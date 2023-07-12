import { Injectable } from '@nestjs/common';
import {InjectModel, Prop} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionType } from '../schemas/transaction_type.schema';
import { Transaction as TransactionModel } from '../models/transaction';
import { KafkaService } from '../kafka/kafka';
import { CreateTransactionDto } from '../dto/create_transaction';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {

  private readonly transactionTypeCache: Record<number, string>;

  public constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(TransactionType.name) private transactionTypeModel: Model<TransactionType>,
    private readonly events: KafkaService,
  ) {
    this.transactionTypeCache = {};
  }

  public async findAll(): Promise<TransactionModel[]> {
    const list = await this.transactionModel.find().exec();
    const result = [];
    for (let i = 0; i < list.length; i++) {
      result.push(
        await this.toModel(list[i])
      );
      delete list[i];
    }

    return result;
  }

  public registerApproval(data): Promise<void> {
    return this.registerStatus(data.transactionExternalId, TransactionModel.STATUS_APPROVED)
  }

  public async registerRejection(data): Promise<void> {
    return this.registerStatus(data.transactionExternalId, TransactionModel.STATUS_REJECTED)
  }

  private async registerStatus(_id: string, status: string): Promise<void> {
    await this.transactionModel.updateOne({ _id }, { status });
  }

  private async toModel(model: Transaction): Promise<TransactionModel> {
    return new TransactionModel({
      transactionExternalId: model._id,
      transactionType: {
        name: await this.type(model.tranferTypeId)
      },
      transactionStatus: {
        name: model.status,
      },
      createdAt: model.createdAt,
      value: model.value,
    });
  }

  public async findOne(id: string): Promise<TransactionModel> {
    const model = await this.transactionModel.findById(id).exec();

    return model ? this.toModel(model) : null;
  }

  public async create(createTransactionDto: CreateTransactionDto): Promise<TransactionModel> {
    const type = await this.type(createTransactionDto.tranferTypeId);
    if (!type) {
      throw new Error('TranferTypeId not found');
    }

    const model = new this.transactionModel({
      _id: uuidv4(),
      accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
      accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
      status: TransactionModel.STATUS_PENDING,
      tranferTypeId: createTransactionDto.tranferTypeId,
      value: createTransactionDto.value,
    });
    await model.save();
    const transaction = await this.toModel(model);

    await this.events.emit('transaction_created', {
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value
    });

    return transaction;
  }

  private async type(id: number) {
    const type = this.transactionTypeCache[id];
    if (type) {
      return type;
    }
    const model = await this.transactionTypeModel.findById(id).exec();
    if (!model) {
      return null;
    }
    this.transactionTypeCache[id] = model.name;

    return model.name;
  }
}
