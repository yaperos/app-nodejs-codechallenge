import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  tranferTypeId: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
