import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionStatusInput {
  @Field()
  name: string;
}
