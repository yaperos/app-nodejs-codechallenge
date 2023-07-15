import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class GetTransactionIdDto {
  @IsUUID()
  @IsNotEmpty()
  @Field()
  id: string;
}
