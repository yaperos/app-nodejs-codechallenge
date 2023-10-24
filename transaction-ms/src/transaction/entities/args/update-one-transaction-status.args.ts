import { ArgsType, Field } from '@nestjs/graphql';
import { TransactionStatus } from '../enums/transaction-status.enum';

@ArgsType()
export class UpdateOneTransactionStatusArgs {

    @Field(() => TransactionStatus, {nullable:false})
    status!: keyof typeof TransactionStatus;

    @Field(() => String, {nullable:true})
    id?: string;
}
