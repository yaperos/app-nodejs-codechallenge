import { CreateTransactionInput } from './create-transaction.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateTransactionInput  {
  @IsNotEmpty()
  @Field()
  transactionExternalId: string;

  @IsNotEmpty()
  @Field()
  transactionStatusID: string;

}
