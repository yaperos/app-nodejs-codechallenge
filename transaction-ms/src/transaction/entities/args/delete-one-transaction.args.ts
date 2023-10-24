import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { TransactionWhereUniqueInput } from '../inputs/transaction-where-unique.input';

@ArgsType()
export class DeleteOneTransactionArgs {

    @Field(() => TransactionWhereUniqueInput, {nullable:false})
    @Type(() => TransactionWhereUniqueInput)
    where!: Prisma.AtLeast<TransactionWhereUniqueInput, 'id'>;
}
