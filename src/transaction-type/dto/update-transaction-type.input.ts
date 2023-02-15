import { CreateTransactionTypeInput } from './create-transaction-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionTypeInput extends PartialType(CreateTransactionTypeInput) {
  @Field()
  id: string;
}
