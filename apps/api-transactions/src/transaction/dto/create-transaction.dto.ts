import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @Field(() => Int)
  tranferTypeId: number;

  @IsNotEmpty()
  @Field()
  value: number;
}
