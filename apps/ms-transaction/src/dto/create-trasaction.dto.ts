import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsString()
  readonly accountExternalIdDebit: string;

  @Field()
  @IsString()
  readonly accountExternalIdCredit: string;

  @Field()
  @IsNumber()
  readonly tranferTypeId: number;

  @Field()
  @IsNumber()
  readonly value: number;
}
