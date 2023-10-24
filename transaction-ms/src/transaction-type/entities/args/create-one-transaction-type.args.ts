import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { TransactionTypeCreateInput } from '../inputs/transaction-type-create.input';

@ArgsType()
export class CreateOneTransactionTypeArgs {

    @Field(() => TransactionTypeCreateInput, {nullable:false})
    @Type(() => TransactionTypeCreateInput)
    data!: TransactionTypeCreateInput;
}
