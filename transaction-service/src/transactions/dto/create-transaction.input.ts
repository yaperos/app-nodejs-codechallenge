import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @IsNumber()
  @Field((type) => Int)
  tranferTypeId: number;

  @IsNumber()
  @Field((type) => Int)
  value: number;
}
