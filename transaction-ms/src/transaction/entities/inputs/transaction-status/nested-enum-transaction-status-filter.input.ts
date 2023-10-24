import { Field, InputType } from '@nestjs/graphql';
import { TransactionStatus } from '../../enums/transaction-status.enum';

@InputType()
export class NestedEnumTransactionStatusFilter {

    @Field(() => TransactionStatus, {nullable:true})
    equals?: keyof typeof TransactionStatus;

    @Field(() => [TransactionStatus], {nullable:true})
    in?: Array<keyof typeof TransactionStatus>;

    @Field(() => [TransactionStatus], {nullable:true})
    notIn?: Array<keyof typeof TransactionStatus>;

    @Field(() => NestedEnumTransactionStatusFilter, {nullable:true})
    not?: NestedEnumTransactionStatusFilter;
}
