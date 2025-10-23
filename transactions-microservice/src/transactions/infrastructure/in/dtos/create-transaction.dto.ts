import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @IsUUID(4)
  @Field()
  accountExternalIdDebit: string;

  @IsUUID(4)
  @Field()
  accountExternalIdCredit: string;

  @Field()
  @IsNumber()
  transferTypeId: number;

  @Field()
  @IsNumber()
  value: number;
}
