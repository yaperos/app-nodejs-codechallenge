import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionStatusInput {
  @Field()
  id: string;

  @Field()
  name: string;
}
