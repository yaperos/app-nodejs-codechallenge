import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Transaction extends mongoose.Document {
  @Prop()
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  value: number;

  @Prop()
  status: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
