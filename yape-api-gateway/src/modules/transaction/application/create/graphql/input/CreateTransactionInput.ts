import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
@InputType()
export class CreateTransactionInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  value: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  transferTypeId: number;
}
