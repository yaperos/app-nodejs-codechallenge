import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
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


@Schema()
@ObjectType()
export class TypeGraphQL {
	@Field(() => ID)
	_id: string;

	@Prop({ required: true })
	@Field()
	name: string;

	@Prop({ required: true })
	@Field(type => Int)
	numericId: number;

	@Prop({ required: false, default: uuidv4() })
	@Field()
	typeExternalId: string;
}

export type TypeGraphQLDocument = TypeGraphQL & Document;

export const TypeGraphQLSchema = SchemaFactory.createForClass(TypeGraphQL);