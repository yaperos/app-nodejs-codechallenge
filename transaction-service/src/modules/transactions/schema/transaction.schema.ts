import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

export enum TransactionType {
  TYPE_1 = 1,
  TYPE_2 = 2,
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema({
  collection: 'user_transactions',
  timestamps: true,
})
export class transactionModel {
  @Prop({
    type: String,
    default: () => randomUUID(),
  })
  _id: string;

  @Prop({
    type: String,
  })
  transactionExternalId: string;

  @Prop({
    type: String,
  })
  accountExternalIdDebit: string;

  @Prop({
    type: String,
  })
  accountExternalIdCredit: string;

  @Prop({
    enum: TransactionType,
  })
  transferTypeId: TransactionType;

  @Prop({
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  transactionStatus: TransactionStatus;

  @Prop({
    type: Number,
  })
  amount: number;

  @Prop({
    type: Date,
  })
  created_at: Date;
}

export type transactionDocument = transactionModel & Document;
export const transactionSchema = SchemaFactory.createForClass(transactionModel);
