import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field()
  transactionExternalId: string;

  @Field(() => Int)
  value: number;

  @Field(() => Int)
  transactionTypeId: number;

  @Field(() => Int)
  transactionStatusId: number;
}
