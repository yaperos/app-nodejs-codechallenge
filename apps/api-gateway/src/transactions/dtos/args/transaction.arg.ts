import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetTransactionArg {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  readonly uuid: string;
}
