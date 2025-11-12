import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsNumber, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  tranferTypeId: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  value: number;
}
