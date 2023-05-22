import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {

    @Prop({
		index: true,
	})
	accountExternalIdDebit!: string;

    @Prop({
        index: true,
    })
    accountExternalIdCredit!: string;

    @Prop({
        index: true,
    })
    tranferTypeId!: number;

    @Prop({
        index: true,
    })
    value!: number;

    @Prop({
        index: true,
    })
    status!: string;

    @Prop()
    createdAt: string;

    @Prop()
    updatedAt?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
