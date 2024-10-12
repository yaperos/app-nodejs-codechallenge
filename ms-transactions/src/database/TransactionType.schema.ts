import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionTypeDocument = HydratedDocument<TransactionType>;

@Schema()
export class TransactionType {
  @Prop({ required: true, unique: true })
  code: number;

  @Prop({ required: true })
  name: string;
}

export const TransactionTypeSchema = SchemaFactory.createForClass(TransactionType);