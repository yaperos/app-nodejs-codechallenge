import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { TransactionStatus } from "src/transaction/enums/transaction-status.enum";

@ArgsType()
export class UpdateTransactionArgs {

    @Field( () => String)
    @IsString()
    id?: string;

    @Field( () => TransactionStatus)
    @IsString()
    transactionStatus?: TransactionStatus;
}