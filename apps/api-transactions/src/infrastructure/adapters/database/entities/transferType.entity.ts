import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaType } from 'mongoose';

@Schema()
export class Transfertype extends Document{
    @Prop({type: Number})
    tranferTypeId: number;

    @Prop()
    name: string;

    @Prop()
    created_at: Date;
}

export const TransfertypeSchema = SchemaFactory.createForClass(Transfertype);