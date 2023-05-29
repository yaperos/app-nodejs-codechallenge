import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TransactionsDocument = Transactions & Document;
export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Transactions {
  @Prop({
    index: true,
    unique: true,
    default: uuidv4,
  })
  transactionExternalId: string;

  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop({
    required: true,
  })
  transferTypeId: string;

  @Prop({
    required: true,
  })
  value: number;

  @Prop({
    type: Object,
    default: TransactionStatus.PENDING,
  })
  transactionStatus: { name: TransactionStatus };

  @Prop({ type: Object })
  transactionType: { name: string };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
