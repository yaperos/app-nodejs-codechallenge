import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

class ObjectWithName extends Document {
  @Prop()
  name: string;
}

@Schema()
export class TransactionState extends Document {
  @Prop()
  transactionId: string;

  @Prop()
  transactionType: ObjectWithName;

  @Prop()
  transactionStatus: ObjectWithName;

  @Prop()
  value: number;

  @Prop()
  createdAt: Date;
}

export const TransactionStateSchema =
  SchemaFactory.createForClass(TransactionState);
