import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateTransactionInput {
  @Field()
  transactionExternalId: string;

  @Field((type) => Int)
  transactiontStatusId: number;
}
