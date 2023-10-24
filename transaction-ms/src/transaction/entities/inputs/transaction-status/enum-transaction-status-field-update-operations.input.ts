import { Field, InputType } from '@nestjs/graphql';
import { TransactionStatus } from '../../enums/transaction-status.enum';

@InputType()
export class EnumTransactionStatusFieldUpdateOperationsInput {

    @Field(() => TransactionStatus, {nullable:true})
    set?: keyof typeof TransactionStatus;
}
