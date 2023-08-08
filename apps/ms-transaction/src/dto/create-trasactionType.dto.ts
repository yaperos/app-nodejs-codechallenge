import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateTransactionTypeDto {
  @Field()
  @IsString()
  readonly name: 'PENDING' | 'APPROVED' | 'REJECTED';
}
