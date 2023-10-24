import { Field, InputType, Int } from '@nestjs/graphql';
import { TransactionTypeWhereInput } from './transaction-type-where.input';

@InputType()
export class TransactionTypeWhereUniqueInput {

    @Field(() => Int, {nullable:true})
    id?: number;

    @Field(() => String, {nullable:true})
    name?: string;

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    AND?: Array<TransactionTypeWhereInput>;

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    OR?: Array<TransactionTypeWhereInput>;

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    NOT?: Array<TransactionTypeWhereInput>;
}
