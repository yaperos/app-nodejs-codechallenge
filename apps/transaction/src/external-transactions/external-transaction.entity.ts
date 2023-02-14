import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ExternalTransactionStatus } from './enums';

export type ExternalTransactionDocument = HydratedDocument<ExternalTransaction>;

@Schema({ timestamps: true, versionKey: false })
export class ExternalTransaction {
  @Prop()
  transactionType: string;

  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop({
    type: String,
    enum: ExternalTransactionStatus,
    default: ExternalTransactionStatus.PENDING,
  })
  status: ExternalTransactionStatus;

  @Prop()
  value: number;

  createdAt: Date;
}

export const ExternalTransactionSchema =
  SchemaFactory.createForClass(ExternalTransaction);
