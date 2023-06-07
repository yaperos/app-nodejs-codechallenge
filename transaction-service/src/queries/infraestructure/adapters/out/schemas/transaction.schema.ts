import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TransactionsDocument = Transactions & Document;

@Schema()
export class Transactions {
    @Prop()
    _id: string;

    @Prop()
    accountExternalIdDebit: string;

    @Prop()
    accountExternalIdCredit: string;

    @Prop()
    tranferTypeId: number;

    @Prop()
    value: number;

    @Prop()
    status: string;

    @Prop()
    createdAt: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);