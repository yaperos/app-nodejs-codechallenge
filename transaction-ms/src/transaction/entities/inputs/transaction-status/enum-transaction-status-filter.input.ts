import { Field, InputType } from '@nestjs/graphql';
import { TransactionStatus } from '../../enums/transaction-status.enum';
import { NestedEnumTransactionStatusFilter } from './nested-enum-transaction-status-filter.input';

@InputType()
export class EnumTransactionStatusFilter {

    @Field(() => TransactionStatus, {nullable:true})
    equals?: keyof typeof TransactionStatus;

    @Field(() => [TransactionStatus], {nullable:true})
    in?: Array<keyof typeof TransactionStatus>;

    @Field(() => [TransactionStatus], {nullable:true})
    notIn?: Array<keyof typeof TransactionStatus>;

    @Field(() => NestedEnumTransactionStatusFilter, {nullable:true})
    not?: NestedEnumTransactionStatusFilter;
}
