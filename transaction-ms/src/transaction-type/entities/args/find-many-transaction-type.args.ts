import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { TransactionTypeWhereUniqueInput } from '../inputs/transaction-type-where-unique.input';
import { TransactionTypeWhereInput } from '../inputs/transaction-type-where.input';

@ArgsType()
export class FindManyTransactionTypeArgs {

    @Field(() => TransactionTypeWhereInput, {nullable:true})
    @Type(() => TransactionTypeWhereInput)
    where?: TransactionTypeWhereInput;

    @Field(() => TransactionTypeWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TransactionTypeWhereUniqueInput, 'id' | 'name'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;
}
