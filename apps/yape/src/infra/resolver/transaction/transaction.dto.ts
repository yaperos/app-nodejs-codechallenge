import { Field, Float, InputType, Int } from "@nestjs/graphql";
import { IsUUID, IsNumber } from 'class-validator';

@InputType()
export class TransactionDto {

  @IsUUID()
  @Field()
  accountExternalIdDebit: string;

  @IsUUID()
  @Field()
  accountExternalIdCredit: string;

  @IsNumber()
  @Field(() => Int)
  tranferTypeId: number;

  @IsNumber()
  @Field(() => Float)
  value: number;

}