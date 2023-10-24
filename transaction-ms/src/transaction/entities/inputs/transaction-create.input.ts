import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';

@InputType()
export class TransactionCreateInput {

    @Field(() => GraphQLUUID, {nullable:false})
    accountExternalIdDebit!: string;

    @Field(() => GraphQLUUID, {nullable:false})
    accountExternalIdCredit!: string;

    @Field(() => Float, {nullable:false})
    value!: number;

    @Field(() => Int, {nullable:false})
    transferTypeId!: number;
}
