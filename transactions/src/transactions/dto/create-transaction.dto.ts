import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(2)
  @Field(() => Int)
  transferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  value: number;
}
