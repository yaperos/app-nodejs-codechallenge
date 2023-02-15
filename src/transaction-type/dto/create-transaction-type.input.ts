import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionTypeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
