import { TransactionStatuses } from "@app/common/domain/model/transaction.model";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaType } from 'mongoose';

@Schema()
export class Transaction extends Document{
    @Prop()
    name: String;

    @Prop()
    accountExternalIdDebit: string;

    @Prop()
    accountExternalIdCredit: string;

    @Prop()
    created_at: Date;

    @Prop({ type: String, enum: TransactionStatuses })
    transactionStatus: TransactionStatuses;
    
    @Prop({type: Number})
    tranferTypeId: number;

    @Prop({type: Number})
    value: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);