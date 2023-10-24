import { Field, InputType, Int } from '@nestjs/graphql';
import { FloatFieldUpdateOperationsInput, StringUUIDFieldUpdateOperationsInput } from 'src/common/global-types';
import { EnumTransactionStatusFieldUpdateOperationsInput } from './transaction-status/enum-transaction-status-field-update-operations.input';

@InputType()
export class TransactionUpdateInput {

    @Field(() => StringUUIDFieldUpdateOperationsInput, {nullable:true})
    accountExternalIdDebit?: StringUUIDFieldUpdateOperationsInput;

    @Field(() => StringUUIDFieldUpdateOperationsInput, {nullable:true})
    accountExternalIdCredit?: StringUUIDFieldUpdateOperationsInput;

    @Field(() => FloatFieldUpdateOperationsInput, {nullable:true})
    value?: FloatFieldUpdateOperationsInput;

    @Field(() => EnumTransactionStatusFieldUpdateOperationsInput, {nullable:true})
    transactionStatus?: EnumTransactionStatusFieldUpdateOperationsInput;

    @Field(() => Int, {nullable:true})
    transferTypeId?: number;
}
