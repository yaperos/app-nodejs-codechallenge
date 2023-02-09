
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTransactionInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  tranferStatusId: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  id: string;
}
