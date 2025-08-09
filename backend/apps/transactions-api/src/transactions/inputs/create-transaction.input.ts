import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsPositive, IsString } from "class-validator";

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  readonly value: number;

  @Field(() => String)
  @IsString()
  readonly transferTypeId: string

  @Field(() => String)
  @IsString()
  readonly accountExternalIdDebit: string;

  @Field(() => String)
  @IsString()
  readonly accountExternalIdCredit: string;
}