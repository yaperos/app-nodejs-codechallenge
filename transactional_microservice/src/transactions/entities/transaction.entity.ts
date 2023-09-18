import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction extends mongoose.Document {
  @Prop({ auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  accountExternalIdDebit?: string;

  @Prop()
  accountExternalIdCredit?: string;

  @Prop()
  tranferTypeId: number;

  @Prop()
  value: number;

  @Prop({ enum: ['APPROVED', 'REJECTED', 'PENDING'] })
  status: string;

  @Prop(
    raw([
      {
        status: { type: String },
        triggered_at: { type: Date },
      },
    ]),
  )
  tracking: Record<string, Date>;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
