import { Field, InputType, Int } from "@nestjs/graphql";
import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";
import { IsNotEmptyIfAnyPropertyIsEmpty } from "./../../decorators/is-not-empty-account.decorator"
import { TransactionStatus } from "src/transaction/enums/transaction-status.enum";

@InputType()
export class TransactionInput {

    @Field( () => String)
    @IsString()
    id: string;

    @Field( () => String)
    @IsString()
    transactionExternalId: string;

    @Field( () => String)
    @IsString()
    transactionType: string;

    @Field( () => TransactionStatus)
    @IsNumber()
    transactionStatus: TransactionStatus;

    @Field( () => Int)
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @Field( () => Date, { nullable: true })
    created_at?: Date;
}

@InputType()
export class TransactionInputOnject {

    @Field( () => String)
    @IsString()
    transactionCreated: TransactionInput;

}