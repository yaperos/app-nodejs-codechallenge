import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  idempotencyKey: string | null;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field(() => Int)
  transferTypeId: number;

  @Field(() => Float)
  value: number;

  @Field()
  status: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
