import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateTransactionStatusDto {
  @Field()
  @IsString()
  readonly name: 'pending' | 'approved' | 'rejected';
}
