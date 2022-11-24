import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ collection: 'transaction' })
export class TransactionReadEntity{

  @Prop()
  transactionExternalId: string;

  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop()
  value: number;

  @Prop()
  transactionTypeName: string;

  @Prop()
  transactionStatus: string;

  @Prop()
  createAt: Date;

  constructor() {
  }
}
export const TransactionSchema = SchemaFactory.createForClass(TransactionReadEntity);

