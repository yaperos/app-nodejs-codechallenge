import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ type: String })
  _id: string;

  @Prop({ trim: true })
  accountExternalIdDebit: string;

  @Prop({ trim: true })
  accountExternalIdCredit: string;

  @Prop({ trim: true })
  status: string;

  @Prop()
  tranferTypeId: number;

  @Prop()
  value: number;

  createdAt: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);