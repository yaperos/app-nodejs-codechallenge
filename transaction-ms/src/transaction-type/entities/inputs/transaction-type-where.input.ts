import { Field, InputType } from '@nestjs/graphql';
import { IntFilter, StringFilter } from 'src/common/global-types';

@InputType()
export class TransactionTypeWhereInput {

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    AND?: Array<TransactionTypeWhereInput>;

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    OR?: Array<TransactionTypeWhereInput>;

    @Field(() => [TransactionTypeWhereInput], {nullable:true})
    NOT?: Array<TransactionTypeWhereInput>;

    @Field(() => IntFilter, {nullable:true})
    id?: IntFilter;

    @Field(() => StringFilter, {nullable:true})
    name?: StringFilter;
}
