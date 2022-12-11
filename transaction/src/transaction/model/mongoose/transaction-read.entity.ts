import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ collection: 'transaction' })
export class TransactionReadEntity {

  @Prop()
  id: number;

  @Prop()
  amount: number;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop()
  accountDebitId: string;

  @Prop()
  accountCreditId: string;

  @Prop()
  createAt: Date;

  constructor() {
  }
}
export const TransactionSchema = SchemaFactory.createForClass(TransactionReadEntity);

