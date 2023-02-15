import { CreateTransactionStatusInput } from './create-transaction-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionStatusInput extends PartialType(CreateTransactionStatusInput) {
  @Field(() => Int)
  id: string;
}
