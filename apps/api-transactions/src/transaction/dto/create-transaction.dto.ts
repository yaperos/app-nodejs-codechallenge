import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @Field()
  tranferTypeId: number;

  @IsNotEmpty()
  @Field()
  value: number;
}
