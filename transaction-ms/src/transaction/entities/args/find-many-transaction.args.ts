import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { TransactionWhereUniqueInput } from '../inputs/transaction-where-unique.input';
import { TransactionWhereInput } from '../inputs/transaction-where.input';

@ArgsType()
export class FindManyTransactionArgs {

    @Field(() => TransactionWhereInput, {nullable:true})
    @Type(() => TransactionWhereInput)
    where?: TransactionWhereInput;

    @Field(() => TransactionWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;
}
