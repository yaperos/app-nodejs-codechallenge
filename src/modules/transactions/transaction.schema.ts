import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/@base/base.entity';
import { TransactionStatuses, TransactionTypes } from './types/transaction-types-enums';
import { uuid } from 'uuidv4';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction extends BaseEntity {
  @Prop({ required: false, default: uuid() })
  transactionExternalId: string;

  @Prop({ required: true })
  accountExternalIdDebit: string;

  @Prop({ required: true })
  accountExternalIdCredit: string;

  @Prop({ required: true, enum: TransactionTypes })
  transferTypeId: TransactionTypes;

  @Prop({ required: true })
  value: number;

  @Prop({ required: false, enum: TransactionStatuses, default: TransactionStatuses.PENDING })
  transactionStatus: TransactionStatuses;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);