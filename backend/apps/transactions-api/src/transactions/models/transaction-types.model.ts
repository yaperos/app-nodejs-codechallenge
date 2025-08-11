import { Field,ObjectType  } from "@nestjs/graphql";

@ObjectType()
export class TransactionType {
  @Field(() => String)
  readonly id: string;

  @Field(() => String)
  readonly name: string;
}