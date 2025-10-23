import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema({ _id: false, timestamps: false })
class TransactionStatus {
  @Field()
  @Prop({ type: String, required: true })
  name: string;
}

@ObjectType()
@Schema({ _id: false, timestamps: false })
class TransactionType {
  @Field()
  @Prop({ type: String, required: false })
  name: string;
}

@ObjectType()
@Schema({ timestamps: true, collection: 'Transactions' })
export class TransactionModel {
  _id?: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop({ type: String, required: true })
  uuid: string;

  @Field()
  @Prop({ type: String, required: true })
  accountExternalIdDebit: string;

  @Field()
  @Prop({ type: String, required: true })
  accountExternalIdCredit: string;

  @Field()
  @Prop({ type: Number, required: true })
  transferTypeId: number;

  @Field()
  @Prop({ type: String, required: true })
  transactionExternalId: string;

  @Field(() => TransactionType)
  @Prop({ type: TransactionType, required: true })
  transactionType: TransactionType;

  @Field(() => TransactionStatus)
  @Prop({ type: TransactionStatus, required: true })
  transactionStatus: TransactionStatus;

  @Field()
  @Prop({ type: Number, required: true })
  value: number;

  @Field()
  createdAt!: Date;

  updatedAt!: Date;
}

export type TransactionModelDocument = TransactionModel & Document;
export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);
TransactionSchema.methods.toJSON = function (): Partial<TransactionModel> {
  const { __v, ...rest } = this.toObject();
  return rest as Partial<TransactionModel>;
};
