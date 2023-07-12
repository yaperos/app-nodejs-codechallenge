import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionTypeDocument = HydratedDocument<TransactionType>;

@Schema({
  timestamps: true,
})
export class TransactionType {
  @Prop({ type: Number })
  _id: number;

  @Prop({ trim: true })
  name: string;
}

export const TransactionTypeSchema = SchemaFactory.createForClass(TransactionType);