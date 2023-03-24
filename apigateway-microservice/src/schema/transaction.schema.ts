import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Transaction {
   @Prop()
   externalId: string;
   @Prop()
   tranferTypeId: number;
   @Prop()
   accountExternalIdDebit: number;
   @Prop()
   accountExternalIdCredit: string;
   @Prop()
   value: number;
   @Prop()
   status: number;
   @Prop()
   createdAt: Date;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);