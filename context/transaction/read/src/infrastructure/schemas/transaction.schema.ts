import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  transferTypeId: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
