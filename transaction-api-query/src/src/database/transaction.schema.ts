import { TransactionStatus } from '../transaction/transaction-status';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {

  @Prop({
    index: true,
    unique: true,
  })
  id: string;

  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop()
  transferTypeId: number;

  @Prop()
  value: number;

  @Prop({ enum: TransactionStatus })
  status: TransactionStatus;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
