import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum TransactionType {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  accountExternalIdDebit: string;

  @Prop({ required: true })
  accountExternalIdCredit: string;

  @Prop({ required: true })
  tranferTypeId: number;

  @Prop({ required: true })
  value: number;

  @Prop({
    type: String,
    enum: TransactionType,
    default: TransactionType.PENDING,
  })
  transactionStatus: string;

  @Prop()
  createdAt: Date;
}

export const MongoTransactionSchema = SchemaFactory.createForClass(Transaction);
