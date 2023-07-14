import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  transactionExternalId: string;

  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop()
  value: number;

  @Prop(
    raw({
      id: { type: Number },
      name: { type: String },
    }),
  )
  transactionType: Record<string, any>;

  @Prop(
    raw({
      name: { type: String },
    }),
  )
  transactionStatus: Record<string, any>;

  @Prop()
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
