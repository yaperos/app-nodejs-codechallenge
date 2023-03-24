import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
@Schema()
export class Transaction {
   @Prop()
   externalId: string;
   @Prop()
   tranferTypeId: number;
   @Prop()
   accountExternalIdDebit: string;
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