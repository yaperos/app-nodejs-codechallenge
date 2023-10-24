import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { TransactionCreateInput } from '../inputs/transaction-create.input';

@ArgsType()
export class CreateOneTransactionArgs {

    @Field(() => TransactionCreateInput, {nullable:false})
    @Type(() => TransactionCreateInput)
    data!: TransactionCreateInput;
}
