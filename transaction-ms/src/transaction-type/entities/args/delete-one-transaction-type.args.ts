import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { TransactionTypeWhereUniqueInput } from '../inputs/transaction-type-where-unique.input';

@ArgsType()
export class DeleteOneTransactionTypeArgs {

    @Field(() => TransactionTypeWhereUniqueInput, {nullable:false})
    @Type(() => TransactionTypeWhereUniqueInput)
    where!: Prisma.AtLeast<TransactionTypeWhereUniqueInput, 'id' | 'name'>;
}
