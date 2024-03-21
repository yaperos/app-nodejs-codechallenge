import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface TransactionResponse {
  transactionExternalId: string;
  transactionTypeId?: number;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: Date;
}

export enum TransferStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  accountExternalIdDebit: string;

  @Prop({ required: true })
  accountExternalIdCredit: string;

  @Prop({ required: true })
  transferTypeId: number;

  @Prop({ required: true })
  value: number;

  @Prop({ default: 'pending' })
  transactionStatus: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
