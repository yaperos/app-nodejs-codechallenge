import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionTypeInput {
  @Field()
  id: string;

  @Field()
  name: string;

}
