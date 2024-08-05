import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'transaction' })
export class TransactionModel {
  @Prop({ type: String, required: true, unique: true })
  transactionInternalId: string;

  @Prop({ type: String, required: true })
  transactionExternalId: string;

  @Prop({ type: String, required: true })
  accountExternalIdDebit: string;

  @Prop({ type: String, required: true })
  accountExternalIdCredit: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt?: Date;

  @Prop({
    type: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
    },
    required: true,
  })
  transactionStatus: {
    id: number;
    name: string;
  };

  @Prop({
    type: {
      id: { type: Number, required: true },
      name: { type: String, required: true },
    },
    required: true,
  })
  transactionType: {
    id: number;
    name: string;
  };
}

export type TransactionDocument = HydratedDocument<TransactionModel>;
export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
