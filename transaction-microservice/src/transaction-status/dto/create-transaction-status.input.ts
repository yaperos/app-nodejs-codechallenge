import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionStatusInput {
  @Field()
  name: string;
}
