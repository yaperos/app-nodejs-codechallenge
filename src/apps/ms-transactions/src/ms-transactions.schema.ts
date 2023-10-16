import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { AbstractDocument } from '@app/common'
import { SchemaTypes, Types } from 'mongoose'
import { TransactionStatus } from './ms-transactions.constants'

@Schema({ versionKey: false })
export class TransactionDocument extends AbstractDocument {
    @Prop()
    accountExternalIdDebit: string

    @Prop()
    accountExternalIdCredit: string


    @Prop()
    transferTypeId: number

    @Prop()
    value: number

    @Prop({ type: String, enum: TransactionStatus })
    status: TransactionStatus

    @Prop({ type: SchemaTypes.ObjectId })
    transactionExternalId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument)
