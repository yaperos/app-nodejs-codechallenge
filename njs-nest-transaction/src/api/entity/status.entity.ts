import { ObjectType, ID, Field, Int, InputType } from '@nestjs/graphql';
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


// import { ObjectType, Field, ID } from '@nestjs/graphql';
// @Schema()
// @ObjectType()
@InputType()
export class EmbeddedDocumentWithNameGraphQL {@Prop({ required: true })
  @Field()
  name: string;
}

export type EmbeddedDocumentWithNameGraphQLDocument = EmbeddedDocumentWithNameGraphQL & Document;
export const EmbeddedDocumentWithNameGraphQLSchema = SchemaFactory.createForClass(EmbeddedDocumentWithNameGraphQL);

// @Schema()
// @ObjectType()
@InputType()
export class TransactionStatusGraphQL {@Prop({ required: true })
	@Field(() => ID, { nullable: true, defaultValue: null })
	transactionId: string;

	@Prop({ required: true })
	@Field(() => EmbeddedDocumentWithNameGraphQL)
	transactionType: EmbeddedDocumentWithNameGraphQL;

	@Prop({ required: true })
	@Field(() => EmbeddedDocumentWithNameGraphQL)
	transactionStatus: EmbeddedDocumentWithNameGraphQL;

	@Prop({ required: true })
	@Field(() => Int)
	value: number;

	// @Prop({ default: new Date() })
	@Field({ nullable: true })
	createdAt: Date;
}

export type TransactionStatusGraphQLDocument = TransactionStatusGraphQL & Document;
export const TransactionStatusGraphQLSchema = SchemaFactory.createForClass(TransactionStatusGraphQL);