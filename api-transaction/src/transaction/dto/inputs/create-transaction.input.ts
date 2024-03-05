import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
