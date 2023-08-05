import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class EmbeddedDocumentWithName extends Document {
	@Prop()
	name: string;
}

@Schema({ timestamps: true, versionKey: false })
export class TransactionStatus extends Document {
	@Prop()
	transactionId: string;

	@Prop()
	transactionType: EmbeddedDocumentWithName;

	@Prop()
	transactionStatus: EmbeddedDocumentWithName;

	@Prop()
	value: number;

	@Prop({ default: new Date() })
	createdAt: Date;
}

export const TransactionStatusSchema = SchemaFactory.createForClass(TransactionStatus);
