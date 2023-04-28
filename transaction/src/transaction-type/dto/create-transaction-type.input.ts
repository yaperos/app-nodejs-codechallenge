import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionTypeInput {
  @Field()
  name: string;
}
