import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from "class-validator";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  transferTypeId: number;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}