import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateTransactionEventInput {
  @Field()
  id: string;

  @Field()
  transactionExternalId: string;

  @Field((type) => Int)
  transactionTypeId: number;

  @Field((type) => Int)
  transactiontStatusId: number;

  @Field((type) => Float)
  value: number;
}
