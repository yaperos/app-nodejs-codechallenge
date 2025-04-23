import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID, Min, IsInt } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => ID)
  @IsUUID('4') @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field(() => ID)
  @IsUUID('4') @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsInt() @Min(1) @IsNotEmpty()
  transferTypeId: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @IsNotEmpty()
  value: number;
}