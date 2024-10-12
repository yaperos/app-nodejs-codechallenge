import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TransactionStatus } from './TransactionStatus.schema';
import { TransactionType } from './TransactionType.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {

  @Prop({ 
		required: true,
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'TransactionStatus'
	})
	transactionStatus: TransactionStatus;

  @Prop({ 
		required: true,
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'TransactionType'
	})
	transactionType: TransactionType;

	@Prop({ required: true })
	transactionExternalId: string;

	@Prop({ required: true })
	accountExternalIdDebit: string;

	@Prop({ required: true })
	accountExternalIdCredit: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: false })
  isClosed: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);