import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { TransactionWhereInput } from './transaction-where.input';

@ArgsType()
export class FindFirstTransactionArgs {
  @Field(() => TransactionWhereInput, { nullable: true })
  @Type(() => TransactionWhereInput)
  where?: TransactionWhereInput;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => Int, { nullable: true })
  skip?: number;
}
