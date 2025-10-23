import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class GetTransactionDto {
  @Field()
  @IsUUID(4)
  transaction: string;
}
