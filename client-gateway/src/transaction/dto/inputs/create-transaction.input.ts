import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsUUID()
  accountExternalIdDebit: string;

  @Field(() => String)
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsNumber()
  @Type(() => Number)
  tranferTypeId: number;

  @Field(() => Float)
  @IsNumber()
  value: number;
}
