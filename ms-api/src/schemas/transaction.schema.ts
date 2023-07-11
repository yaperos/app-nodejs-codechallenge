import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ unique: true, trim: true, required: true })
  id: string;

  @Prop({ trim: true })
  description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);