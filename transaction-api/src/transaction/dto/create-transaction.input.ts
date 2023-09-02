import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class createTransactionInput {
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @Min(0, { message: 'Transfer type must be greater than 0' })
  @Max(3, { message: 'Transfer type must be less than 3' })
  @IsNotEmpty()
  @Field()
  transferType: number;

  @Min(0, { message: 'Value must be greater than 0' })
  @IsNotEmpty()
  @Field()
  value: number;
}
