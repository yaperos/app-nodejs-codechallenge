import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ETransactionStatus } from '../enum/TransactionStatus.enum';

export type TransactionStatusDocument = HydratedDocument<TransactionStatus>;

@Schema()
export class TransactionStatus {
  @Prop({ required: true, unique: true })
  code: ETransactionStatus;

  @Prop({ required: true })
  name: string;
}

export const TransactionStatusSchema = SchemaFactory.createForClass(TransactionStatus);