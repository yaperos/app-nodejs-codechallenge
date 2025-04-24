import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsInt, IsPositive } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountExternalIdDebit!: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit!: string;

  @Field()
  @IsInt()
  transferTypeId!: number;

  @Field(() => Float)
  @IsPositive()
  value!: number;

}
