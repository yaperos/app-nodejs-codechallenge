import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
