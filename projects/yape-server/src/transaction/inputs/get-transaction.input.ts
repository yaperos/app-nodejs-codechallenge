import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class GetTransactionInput {
  @Field(() => String, { nullable: true })
  readonly transactionId?: string;

  @Field(() => Number, { nullable: true })
  readonly amount?: number;

  @Field(() => String, { nullable: true })
  readonly cardId?: string;

  @Field(() => String, { nullable: true })
  readonly cardTypeName?: number;

  @Field(() => String, { nullable: true })
  readonly status?: string;

  @Field(() => String, { nullable: true })
  readonly createdAt?: string;
}
