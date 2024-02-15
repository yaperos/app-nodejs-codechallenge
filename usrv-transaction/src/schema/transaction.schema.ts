import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<Transaction>

@Schema({ collection: 'transactions', timestamps: true })
export class Transaction {
    @Prop()
    transactionExternalId: string

    @Prop()
    accountExternalIdDebit: string

    @Prop()
    accountExternalIdCredit: string

    @Prop()
    tranferTypeId: string

    @Prop()
    status: string

    @Prop()
    value: number
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)