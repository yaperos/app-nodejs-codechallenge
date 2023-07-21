import { CreateTransactionstatusInput } from './create-transactionstatus.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionstatusInput extends PartialType(CreateTransactionstatusInput) {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
