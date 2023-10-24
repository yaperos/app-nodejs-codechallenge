import { Field, InputType } from '@nestjs/graphql';

import { FloatFilter, IntFilter, StringFilter } from 'src/common/global-types';
import { EnumTransactionStatusFilter } from './transaction-status/enum-transaction-status-filter.input';

@InputType()
export class TransactionWhereInput {

    @Field(() => [TransactionWhereInput], {nullable:true})
    AND?: Array<TransactionWhereInput>;

    @Field(() => [TransactionWhereInput], {nullable:true})
    OR?: Array<TransactionWhereInput>;

    @Field(() => [TransactionWhereInput], {nullable:true})
    NOT?: Array<TransactionWhereInput>;

    @Field(() => StringFilter, {nullable:true})
    id?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    accountExternalIdDebit?: StringFilter;

    @Field(() => StringFilter, {nullable:true})
    accountExternalIdCredit?: StringFilter;

    @Field(() => IntFilter, {nullable:true})
    transactionTypeId?: IntFilter;

    @Field(() => FloatFilter, {nullable:true})
    value?: FloatFilter;

    @Field(() => EnumTransactionStatusFilter, {nullable:true})
    transactionStatus?: EnumTransactionStatusFilter;
}
