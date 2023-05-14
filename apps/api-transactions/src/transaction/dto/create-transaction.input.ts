import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  accountExternalIdCredit: string;

  // @IsNotEmpty()
  @Field(() => Int, { name: 'transferTypeId' })
  transactionTypeId: number;

  // @IsNotEmpty()
  transactionStatusId: number;

  @IsNotEmpty()
  @Field()
  value: number;
}
