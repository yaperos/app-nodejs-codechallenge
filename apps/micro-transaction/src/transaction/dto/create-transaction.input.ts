import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @IsUUID()
  @Field()
  @IsOptional()
  accountExternalIdDebit: string;

  @IsUUID()
  @Field()
  @IsOptional()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @Field()
  @IsInt()
  tranferTypeId: number;

  @IsNumber()
  @Field()
  @IsPositive()
  value: number;
}