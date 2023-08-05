import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class Type extends Document {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	numericId: number;

	@Prop({ required: false, default: uuidv4() })
	typeExternalId: string;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
