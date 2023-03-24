import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Transaction {
   @Prop()
   externalId: string;
   @Prop()
   transferTypeId: number;
   @Prop()
   accountExternalIdDebit: string;
   @Prop()
   accountExternalIdCredit: string;
   @Prop()
   value: number;
   @Prop()
   status: string;
   @Prop()
   createdAt: Date;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);