import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { TransactionCreateInput } from './transaction-create.input';

@ArgsType()
export class CreateOneTransactionArgs {
  @Field(() => TransactionCreateInput, { nullable: true })
  @Type(() => TransactionCreateInput)
  data!: TransactionCreateInput;
}
