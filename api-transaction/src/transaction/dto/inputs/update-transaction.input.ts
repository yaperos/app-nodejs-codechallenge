import { Field, Float, ID, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateTransactionInput } from './create-transaction.input';

@InputType()
export class UpdateTransactionInput extends PartialType(CreateTransactionInput) {
  @Field(() => ID)
  id?: string;

  @Field(() => String)
  accountExternalIdDebit?: string;

  @Field(() => String)
  accountExternalIdCredit?: string;

  @Field(() => Int)
  tranferTypeId?: number;

  @Field(() => Int)
  transactionStatus?: number;

  @Field(() => Float)
  value?: number;

  @Field(() => String)
  createdAt?: Date;
}
