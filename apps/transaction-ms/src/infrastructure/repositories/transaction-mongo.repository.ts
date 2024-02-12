import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transaction } from '../../domain/model/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Model } from 'mongoose';
import { Status } from '@app/common/constants/constants';

@Schema()
export class TransactionDb {
  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop()
  status: string;
  static getClassName() {
    return 'Transaction';
  }
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDb);

export class TransactionMongoRepository implements TransactionRepository {
  constructor(
    @InjectModel(TransactionDb.getClassName())
    private transactionModel: Model<TransactionDb>,
  ) {}
  save(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Transaction | undefined> {
    const transactionDb = await this.transactionModel.findById(id);

    if (transactionDb) {
      return {
        id: transactionDb._id.toString(),
        accountExternalIdDebit: transactionDb.accountExternalIdDebit,
        accountExternalIdCredit: transactionDb.accountExternalIdCredit,
        status: transactionDb.status as Status,
      };
    }
    return;
  }
}
