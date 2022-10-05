import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Max, Min } from "class-validator";

@InputType()
export class TransactionRequest {

    @IsNotEmpty()
    @IsUUID()
    @Field(() => String, { description: `Account external Id Debit`, nullable: false })
    accountExternalIdDebit: string;

    @IsNotEmpty()
    @IsUUID()
    @Field(() => String, { description: `Account external Id Credit`, nullable: false })
    accountExternalIdCredit: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: "Type Transaction must be 1" })
    @Max(1, { message: "Type Transaction must be 1" })
    @Field(() => Int, { description: `Type Transaction`, nullable: false })
    tranferTypeId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.1)
    @IsPositive()
    @Field(() => Int, { description: `Value Transaction`, nullable: false })
    value: number;
}