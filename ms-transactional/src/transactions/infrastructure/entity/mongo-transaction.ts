import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Channel,
  Transaction,
  TransactionStatus,
  TransferType,
} from 'src/transactions/domain/entity/transaction';

@Schema({ collection: 'transactions', timestamps: true })
export class MongoTransaction implements Transaction {
  @Prop({ required: true, unique: true, type: String })
  transactionId: string;

  @Prop({ required: true, type: String })
  accountExternalIdDebit: string;

  @Prop({ required: true, type: String })
  accountExternalIdCredit: string;

  @Prop({ required: true, type: String })
  channel: Channel;

  @Prop({ required: true, type: String })
  transferType: TransferType;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: Date, default: Date.now })
  updatedAt: Date;
}

export const MongoTransactionSchema =
  SchemaFactory.createForClass(MongoTransaction);
